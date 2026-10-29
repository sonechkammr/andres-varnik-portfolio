# Architecture and interaction notes

## Runtime

The portfolio runs entirely in the browser using HTML, CSS and JavaScript. There is no application server, database, API key or production API call behind the SQL/API example. The local Node server is a development convenience only.

The deployed artifact is `index.html`. Its pictures, fonts, PDF CV and Practice Wheel are embedded. The file is approximately 6.7 MB, a deliberate trade-off for portability. Links to external projects and social profiles still need a connection.

## Source layout and build

`src/index.template.html` preserves the original document order. Five CSS fragments retain the original cascade, including the final compatibility rules. Three JavaScript fragments retain their execution order:

1. `main.js`: the case journey, explanation demos, project link setup and runner.
2. `controls.js`: theme switching, persisted interface preferences and translation.
3. `gallery.js`: the photography deck, input handling, viewer and optional sound.

The build recognizes five marker forms:

| Marker | Expansion |
| --- | --- |
| `/* @inline styles/base.css */` | CSS source inserted into its existing style element. |
| `// @inline scripts/main.js` | JavaScript source inserted into its existing script element. |
| `{{asset:assets/example.webp}}` | A data URI using the MIME type from `assets/manifest.json`. |
| `{{base64:assets/projects/practice-wheel.html}}` | Base64 bytes used to construct the local project link. |
| `{{json:translations.et.json}}` | Parsed, serialized translation data. |

Run `npm run build` after edits, then `npm run check`. The build does not fetch resources or use a package bundler. `index.html` is intentionally tracked.

## Case journey

A persistent visual panel changes its position, scale, orientation and content in response to the journey's progress. The text and background continue past it. The fictional missing `warehouse_id` remains the connection between the SQL evidence and failed dispatch request.

The resolved state identifies the missing mapping, the correction to warehouse 7 and a successful retry. It is an illustrative case, not a live support dashboard. The chapter buttons and step-through option offer direct navigation through the same story.

## Theme and translation

Young Serif font faces and typography are shared by both visual modes. The lantern stylesheet changes the palette and decoration without overriding the heading font or its metrics. The lantern stylesheet is enabled or disabled as a unit. The button updates its pressed state and accessible name. English is the starting language unless a saved preference is available. Estonian copy is stored in `src/translations.et.json`; the gallery owns its short dynamic labels and captions.

Translation preserves SQL and code examples. The portfolio stores interface choices in local storage and tolerates storage being unavailable. The language switch does not translate the downloaded English CV, photographs, original app screenshots or linked external projects.

## Projector motion

Each mounted photograph has a front, a back and thin side edges. CSS perspective and `translate3d`/`rotateY` provide the depth. `requestAnimationFrame` calculates each pose from elapsed time rather than frame count.

For an ordinary 1,400 ms forward turn, all cards follow one continuous rail. A shared quintic ease controls the position, with zero velocity and acceleration at both ends. Position, depth and angle are calculated from the same distance parameter; no card reverses its rotation halfway through the turn.

| Progress | Outgoing frame | Incoming frame |
| --- | --- | --- |
| Start | Face-on at the front. | At the right side, nearly edge-on with its left edge towards the viewer. |
| Middle | Moves left and back; its left edge recedes. | Moves left and forward, opening towards the viewer. |
| End | Nearly edge-on on the left, with its right edge visible. | Face-on at the front, with a restrained settling rotation. |

Reverse navigation mirrors the path. A perspective correction keeps the resting side frames just on the front-facing side of edge-on. The small final rotational adjustment is under one degree, has smooth endpoints and is suppressed during queued turns. It is not a position spring.

The card parent remains opaque and retains its 3D context. Alpha is applied to individual faces and edges, avoiding Chromium's flattening of a parent with fractional opacity. Depth sorting is handled by the 3D scene rather than a changing per-frame z-index.

A swipe must exceed 40 pixels and be predominantly horizontal. Distance and speed select one to five queued turns. A multi-frame sequence begins with a 740 ms turn and increases towards 1,400 ms for the last. The queue is bounded. Vertical touch scrolling remains available.

Fifteen cards are shuffled with Fisher–Yates once on load, using browser randomness. Navigation wraps around that fixed order. The play button schedules the next turn after a 4.4 second rest. Manual navigation, an offscreen gallery or a hidden document stops the slideshow.

Sound is off initially. Enabling it creates a Web Audio context from the button action. A short filtered noise impulse and decaying sine tone provide the click and light ring. There is no microphone permission, remote audio request or sound file.

## Photograph assets

The JPEG files in `assets/photography/` are the supplied source images. Their Instagram chrome is hidden by the SVG `viewBox` values in the template. The source pixels are not rewritten. Portrait and landscape images keep their proportions within the slide mount.

To replace a photo:

1. Replace its asset or add a new asset entry and marker.
2. Update the relevant SVG viewport and English/Estonian captions in the template.
3. Update `bytes` and `sha256` in the asset manifest after an intentional replacement.
4. Rebuild, run checks and inspect the front view, edge-on transition and enlarged view.

The current deck and its checks are configured for 15 pictures. Adjust both together when changing the deck size.

## Accessibility and limits

Controls use native buttons, labels, keyboard input and focus styles. The photo viewer uses a native dialog. Gallery arrow keys are handled within the section; game input belongs to its focused track. Reduced-motion preferences disable animated gallery turns and automatic playback.

This is not a formal accessibility certification. Touch feel, performance and audio can vary across devices. The examples are simplified teaching visuals, and the translation approach uses a text dictionary rather than a general localization framework. See [Validation](VALIDATION.md) for what was actually checked.
