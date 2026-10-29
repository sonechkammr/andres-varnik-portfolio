# Portfolio v1.0.1 — Motion & Typography Fixes

- Replaced the projector's separate motion phases with one continuous rail and smooth quintic timing.
- Corrected rotation direction: a card moving left turns its left edge away; the incoming right card unfolds towards the viewer.
- Preserved real front/back face rendering by moving opacity off the 3D parent and removing changing z-index values.
- Shared Young Serif font files and heading metrics between the paper and lantern modes.
- Shortened long Estonian labels, bounded text beside illustrations and improved word wrapping.
- Added a tablet navigation breakpoint and extra small-screen adjustments.
- Added regression checks for rotation direction, monotonic motion, symmetry, timing and shared typography.
- Reviewed English/Estonian layouts at 320, 390, 1,024 and 1,440 CSS pixels; physical-device and formal accessibility testing remain outside this release.

Download `Andres-Varnik-Portfolio.html` to open the complete portfolio locally, or `Andres-Varnik-Portfolio-Source.zip` to edit and rebuild it.

---

# Portfolio v1.0.0 — Lantern & Photography

The first packaged GitHub release of Andres Värnik's interactive portfolio.

## Included

- A scroll-driven fictional SQL and API investigation, ending with a verified resolution.
- Warm paper and dark lantern visual modes.
- English by default, with an optional Estonian interface.
- Interactive wave, leverage and refraction explanations.
- Professional experience, technical skills, Mind Garden, the Practice Wheel, music and writing.
- A shuffled deck of 15 photographs with 1.4-second ordinary turns, edge-on motion, depth, restrained settling and optional synthesized sound.
- Buttons, arrow-key navigation, multi-frame swipes, an optional slideshow and an enlarged viewer.
- A small keyboard-symbol runner game.
- A ready-to-open HTML file and editable source with a dependency-free Node build.
- English development, architecture, validation and asset-credit documentation.

## Downloads

- `Andres-Varnik-Portfolio.html`: the complete portfolio in one file. Download it, then open it in a current browser.
- `Andres-Varnik-Portfolio-Source.zip`: the repository source and documentation for editing and rebuilding.

The portfolio itself works offline. Social links and the linked Android release require a connection. Original project screenshots and the embedded Practice Wheel retain their original language.

## Validation

The build and static checks pass. They cover generated JavaScript syntax, internal anchors, unique IDs, all 15 photograph identifiers, embedded Practice Wheel scripts and asset checksums. Browser observations and the remaining device/accessibility testing limits are recorded in `docs/VALIDATION.md`.

## Credits

Andres directed the concept, supplied the personal content and photographs, and reviewed the iterations. Implementation and pixel-art illustration work used AI assistance. See `CREDITS.md` for font notices and reuse information.
