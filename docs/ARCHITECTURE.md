# Architecture and interaction notes

## Runtime

The portfolio runs entirely in the browser using HTML, CSS and JavaScript. There is no application server, database, API key or production API call behind the SQL/API example. The local Node server is a development convenience only.

The deployed artifact is `index.html`. Its pictures, fonts, PDF CV and Practice Wheel are embedded. The file is approximately 6.7 MB, a deliberate trade-off for portability. Links to external projects and social profiles still need a connection.

## Source layout and build

`src/index.template.html` preserves the original document order. CSS fragments retain the original cascade, including the final compatibility rules. Four JavaScript fragments retain their execution order:

1. `main.js`: the case journey, explanation demos, project link setup and runner.
2. `controls.js`: theme switching, persisted interface preferences and translation.
3. `gallery.js`: the photo book, page-turn queue, responsive spreads and localized captions.
4. `easter-egg.js`: the multi-scene hidden arcade. See [ARCADE.md](ARCADE.md).

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

## Photo book

The photo-book section is imported from the supplied `andres-portfolio-v2.html` design. Each CSS 3D leaf has a front and a back, with its transform origin at the spine. A one-second rotation moves it to the opposite side of the spread, with a transient paper shadow. A bounded queue serializes rapid input. A timeout fallback completes the turn if a transition event is interrupted.

Wide layouts use a title page followed by two-sided photo leaves. Narrow layouts show one photo per leaf. All 15 photos are shuffled once per load; changing layout retains the current photo rather than reshuffling. Native arrow buttons, left/right keys, page clicks and horizontal swipes navigate the same state. Only currently visible page faces expose their links to keyboard and assistive technology. Reduced motion removes the page-turn animation.

The Instagram link is available beside the heading and on the final page. Gallery autoplay, projector sound and the enlarged dialog from the earlier carousel are intentionally replaced by the book's direct page interaction. The separate arcade retains its own sound and controls unchanged.

## Revised sandbox investigation

The scroll story now checks other Lumen orders to identify Tallinn warehouse 7. The API panel preserves three explicit request/response pairs: initial POST dispatch returns 400; PATCH sets the warehouse and returns 200; the second POST dispatch returns 202 Accepted. These are fictional sandbox examples, not a live API. The evidence token travels from SQL to the appropriate request. Readability rules increase small interface text, and on phones the language switch moves into the menu.

## Photograph assets

The JPEG files in `assets/photography/` are the supplied source images. Their Instagram chrome is hidden by the SVG `viewBox` values in the template. The source pixels are not rewritten. Portrait and landscape images keep their proportions within the slide mount.

To replace a photo:

1. Replace its asset or add a new asset entry and marker.
2. Update the relevant SVG viewport and English/Estonian captions in the template.
3. Update `bytes` and `sha256` in the asset manifest after an intentional replacement.
4. Rebuild, run checks and inspect both page faces, the fold and the single-page phone view.

The current deck and its checks are configured for 15 pictures. Adjust both together when changing the deck size.

## Accessibility and limits

Controls use native buttons, labels, keyboard input and focus styles. The photo viewer uses a native dialog. Gallery arrow keys are handled within the section; game input belongs to its focused track. Reduced-motion preferences disable animated gallery turns and automatic playback.

This is not a formal accessibility certification. Touch feel, performance and audio can vary across devices. The examples are simplified teaching visuals, and the translation approach uses a text dictionary rather than a general localization framework. See [Validation](VALIDATION.md) for what was actually checked.
