import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';

const source = await readFile(new URL('../src/scripts/gallery.js', import.meta.url), 'utf8');
assert(!source.includes('card.style.opacity='), 'Opacity on the 3D card parent flattens its front and back faces.');
const model = source.split('// motion-model:start')[1]?.split('// motion-model:end')[0];
assert(model, 'The projector motion model must remain independently testable.');
const { pose, ease } = runInNewContext(`${model}; ({ pose: projectorPose, ease: projectorEase })`);
const near = (a, b, tolerance = 1e-8) => assert(Math.abs(a - b) <= tolerance, `${a} differs from ${b}`);

for (const radius of [150, 180, 330, 390]) {
  let previous = pose(1, radius);
  for (let i = 1; i <= 2000; i++) {
    const distance = 1 - 2 * ease(i / 2000);
    const current = pose(distance, radius);
    assert(current.x <= previous.x + 1e-8, 'A left-moving frame must never reverse its translation.');
    assert(current.r <= previous.r + 1e-8, 'A left-moving frame must never reverse its rotation.');
    assert(Math.abs(current.x - previous.x) < 2, 'Position jumped between adjacent time samples.');
    const mirrored = pose(-distance, radius);
    near(mirrored.x, -current.x); near(mirrored.r, -current.r); near(mirrored.z, current.z);
    previous = current;
  }
  for (const perspective of [900, 1250]) {
    const side = pose(1, radius, perspective);
    const rotation = side.r * Math.PI / 180;
    assert((perspective - side.z) * Math.cos(rotation) - side.x * Math.sin(rotation) > 0,
      'The resting right frame must show its front-facing edge, not its back.');
  }
  const outgoing = pose(-.5, radius), incoming = pose(.5, radius);
  // CSS rotation maps the left edge's depth to halfWidth * sin(angle).
  assert(Math.sin(outgoing.r * Math.PI / 180) < 0, 'The outgoing left edge must recede.');
  assert(Math.sin(incoming.r * Math.PI / 180) > 0, 'The incoming left edge must face the viewer.');
  near(pose(0, radius).r, 0); near(pose(0, radius).z, 88);
  assert(outgoing.z < pose(0, radius).z, 'The outgoing card must move into depth.');
}
near(ease(0), 0); near(ease(1), 1);
assert(ease(.0001) < 1e-9 && 1 - ease(.9999) < 1e-9, 'Acceleration must enter and leave smoothly.');
const base = await readFile(new URL('../src/styles/base.css', import.meta.url), 'utf8');
const dark = await readFile(new URL('../src/styles/lantern.css', import.meta.url), 'utf8');
assert(base.includes("font-family: 'Young Serif'"), 'The shared font must load with the lantern switched on.');
assert(base.includes("--display:'Young Serif'"), 'Both themes must use Young Serif.');
assert(!/--display\s*:/.test(dark), 'The dark theme must not override typography.');
console.log('Passed: projector direction, monotonic movement, mirror symmetry, smooth endpoints and shared theme typography.');
