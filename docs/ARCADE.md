# Hidden arcade

A desktop-first Canvas game hidden in the contact section. It starts as a small monochrome runner. Two keyboard symbols precede a doorway; crossing it unfolds the game into a viewport-sized overlay. No narrative captions announce the transformations.

## Sequence

1. Automatic monochrome runner: Space / Up / click jumps.
2. Colour pixel platformer: A/D or arrows move; Space / Up / W jumps. Collect the glowing lantern from the raised platforms before the exit opens.
3. Top-down arena: WASD / arrows move, mouse aims, holding the left button casts a sustained cone of light. Ten creatures arrive over time. Their bodies shrink as light drains their health; contact costs a heart. Clear the room and enter its north doorway.
4. A stylized perspective sanctuary: move forward with W / Up to the lit doorway. A partly concealed side door then offers a music-video Easter egg as an explicit external link. This is a perspective Canvas scene, not a 3D shooter.

## Behaviour

- Three hearts are shared across the run. A hit gives two seconds of invulnerability. Zero hearts means game over; Restart starts from the beginning.
- Sound is off initially. The sound button unlocks locally synthesized tones and a small original repeating musical pattern; no commercial soundtrack is bundled.
- Escape pauses, the pause button resumes, and the close button returns to the page. Keyboard handling is scoped to the focused canvas. Losing focus or hiding the tab pauses the game.
- The expanded overlay traps Tab focus among its controls, has a close button and does not request browser fullscreen or pointer lock.
- Reduced motion disables the unfolding CSS transition; the game itself is user-initiated animation.
- Touch/mobile gameplay is not a supported target for this iteration. The game requires keyboard and mouse for its arena.
- Play length depends on movement, aiming and retries; it has not been timed through a human playtest to certify the proposed 90–120 seconds.

## Implementation and checks

`src/scripts/easter-egg.js` owns the scene machine, fixed logical 960×540 drawing area, frame-time physics, platform collisions, beam damage, audio and input. `src/styles/easter-egg.css` owns the embedded/expanded states. Graphics are code-drawn with a consistent long-haired, glasses-and-striped-hoodie character; there are no copied game sprites.

`node scripts/check-arcade.mjs` executes the actual engine in an isolated mock DOM with a test-only hook that is never included in the built site. It checks the first doorway, heart depletion, physical jumps to collect the lantern, arena transition, sustained beam damage, the final exit, secret availability and reset. These engine checks do not replace a complete keyboard-and-mouse playthrough by a person. Browser checks cover startup, the first visual expansion, pause/close and error logs.
