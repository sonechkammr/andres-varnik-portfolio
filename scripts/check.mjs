import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 4, 'Main, controls, photography and arcade scripts must be present.');
scripts.forEach((match, index) => new Script(match[1], { filename: `inline-${index}.js` }));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs.');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
for (const id of ['lantern-switch', 'phase', 'runner-track', 'photography', 'pg-viewer']) assert(ids.includes(id), `Missing feature: ${id}`);
const photos = [...html.matchAll(/data-photo-id="([^"]+)"/g)].map(match => match[1]);
assert.equal(photos.length, 15, 'All 15 photographs must be included.');
assert.equal(new Set(photos).size, 15, 'Photographs must not repeat in the initial deck.');
assert(html.includes('<html lang="en"'), 'English must be the default language.');
assert(!/\{\{(?:asset|base64|json):|@inline (?:styles|scripts)\//.test(html), 'Unresolved build marker.');
assert(!/\b(?:src|href)="(?:file:|[A-Za-z]:[\\/])/.test(html), 'Machine-specific file reference.');
const manifest = JSON.parse(await readFile(path.join(root, 'assets/manifest.json'), 'utf8'));
for (const asset of manifest) {
  const bytes = await readFile(path.join(root, asset.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `Asset changed: ${asset.path}. Update the manifest after an intentional replacement.`);
}
const wheel = await readFile(path.join(root, 'assets/projects/practice-wheel.html'), 'utf8');
for (const [index, match] of [...wheel.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].entries()) new Script(match[1], { filename: `practice-wheel-${index}.js` });
console.log(`Passed: ${scripts.length} scripts, ${ids.length} unique IDs, 15 photos, ${manifest.length} intact assets and the embedded Practice Wheel.`);
console.log('These static checks do not replace browser, touch or screen-reader testing.');
await import('./check-motion.mjs');

await import('./check-arcade.mjs');
