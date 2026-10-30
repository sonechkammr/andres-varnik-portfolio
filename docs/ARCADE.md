# Hidden arcade

A keyboard-and-touch Canvas game hidden in the contact section. It starts as a small monochrome runner. Two keyboard symbols precede a doorway; crossing it unfolds the game into a viewport-sized overlay. No narrative captions announce the transformations.

## Sequence

1. Automatic monochrome runner: Space / Up / click jumps.
2. Colour pixel platformer: A/D or arrows move; Space / Up / W jumps. Collect the glowing lantern from the raised platforms before the exit opens.
3. Top-down arena: WASD / arrows move, mouse aims, holding the left button casts a sustained cone of light. Ten creatures arrive over time. Their bodies shrink as light drains their health; contact costs a heart. Clear the room and enter its north doorway.
4. A stylized perspective sanctuary: move forward with W / Up to the lit doorway. A partly concealed side door then offers a music-video Easter egg as an explicit external link. This is a perspective Canvas scene, not a 3D shooter.

## Behaviour

- Three hearts are shared across the run. A hit gives two seconds of invulnerability. Zero hearts means game over; Restart starts from the beginning.
- Sound is off initially. The sound button unlocks locally synthesized tones and a small original repeating musical pattern; no commercial soundtrack is bundled.
- A persistent top-right close button or Escape exits the expanded game, restores the page position and pauses the run without losing progress. In the embedded runner, Escape pauses. Losing focus or hiding the tab also pauses the game.
- After victory or Game Over, scrolling upward (or swiping downward) closes the overlay and continues upward on the site. Active gameplay does not consume a wheel gesture as an exit.
- The expanded overlay traps Tab focus among its controls, has a close button and does not request browser fullscreen or pointer lock.
- Reduced motion disables the unfolding CSS transition; the game itself is user-initiated animation.
- Phones get a full-viewport game from the first tap, with the canvas filling the available width in portrait and landscape. A cropped camera follows the player instead of stretching or shrinking the whole desktop scene. The level, collisions and movement speeds are shared across layouts.
- Semi-transparent D-pad and action buttons sit below the game, away from the playfield. Independent captured pointers support moving and jumping together; release, cancellation, blur, scene transitions and exit clear held input. The action button becomes a sustained lantern beam in the arena (aim assist selects the nearest creature within range) and forward movement in the final scene. Touching the playfield also aims manually.
- Control labels and hints switch between English and Estonian. Safe-area spacing and dynamic viewport height keep the exit and controls reachable on phones.
- Play length depends on movement, aiming and retries; it has not been timed through a human playtest to certify the proposed 90–120 seconds.

## Implementation and checks

`src/scripts/easter-egg.js` owns the scene machine, fixed logical 960×540 drawing area, frame-time physics, platform collisions, beam damage, audio and input. `src/styles/easter-egg.css` owns the embedded/expanded states. Graphics are code-drawn with a consistent long-haired, glasses-and-striped-hoodie character; there are no copied game sprites.

`node scripts/check-arcade.mjs` executes the actual engine in an isolated mock DOM with a test-only hook that is never included in the built site. It checks the first doorway, heart depletion, physical jumps to collect the lantern, arena transition, sustained beam damage, the final exit, secret availability and reset. These engine checks do not replace a complete keyboard-and-mouse playthrough by a person. Engine checks also exercise simultaneous direction/jump pointers, cancellation, lamp collection using touch controls, lantern damage without a mouse, final-scene touch input and portrait/landscape camera bounds. Browser checks cover startup, touch-control holding, full-width portrait/landscape layouts, pause/close and error logs; physical-device multi-touch testing remains separate.
