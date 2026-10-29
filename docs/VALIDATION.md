# Validation and known limits

## Automated checks

Run from the repository root:

```sh
npm run build
npm run check
```

The checker verifies:

- Syntax of all three generated inline JavaScript blocks and the embedded Practice Wheel scripts.
- Unique HTML IDs and valid internal anchor targets.
- Presence of the principal interactive sections.
- Exactly 15 distinct photograph identifiers.
- English as the default document language.
- Absence of unresolved source markers and machine-specific file references.
- SHA-256 integrity of the assets listed in the manifest.
- Projector direction, monotonic movement, symmetry and smooth timing endpoints using the actual motion model.
- Shared Young Serif definitions without a dark-theme font override.

The checks are static. They do not claim to measure animation smoothness, accessibility conformance or image composition.

## Browser checks performed during development

The integrated portfolio was inspected in the in-app browser at narrow and wide viewport sizes, including 320, 390, 1,024 and 1,440 CSS pixels wide during the v1.0.1 layout review. The following were exercised:

| Check | Observed result |
| --- | --- |
| Single forward and reverse turns | Frames entered depth and rotated towards an edge-on pose; the deck reached the next resting state. |
| Strong horizontal gesture | A five-frame sequence completed and the counter advanced by five. |
| Enlarged viewer | The central card opened, viewer navigation updated the image and counter, and the close button returned to the deck. |
| Sound control | The optional sound state toggled from off to on. Perceived loudness was not measured. |
| Slideshow | The photo counter advanced automatically while playback was enabled. |
| EN / ET and lantern | Gallery copy, navigation labels and theme updated correctly. Estonian heading font, size and measured height matched across both themes. |
| Estonian layout | No overflowing heading words were found at the reviewed widths. On mobile, project copy ended above its illustration. The tablet menu opened and closed correctly. |
| Responsive layout | No document-width overflow was observed at the inspected widths. |
| JavaScript console | No error entries were observed during the gallery checks. |

These observations apply to the reviewed implementation. The repository packaging retains the same content and interaction code; it does not imply a separate test on every browser or a physical phone.

## Recommended manual regression pass

1. Follow the complete order story using both scroll and chapter controls.
2. Switch the lantern and language at the top and in later sections.
3. Use all three explanation tabs and their sliders with mouse and keyboard.
4. Navigate the deck in both directions, queue several turns and inspect wraparound.
5. Check the viewer with portrait and landscape photographs.
6. Start the slideshow, scroll away and confirm it stops.
7. Check sound at a comfortable system volume.
8. Try a physical touch device: a short swipe, a strong swipe and a vertical page scroll.
9. Enable reduced motion in the operating system and revisit the page.
10. Open the CV, Practice Wheel and external project links; play and pause the runner.

## Known limits

- The self-contained file is about 6.7 MB. It prioritizes being easy to send and open over incremental asset loading.
- No browser matrix, physical-device performance benchmark, screen-reader audit or formal WCAG assessment has been completed.
- The teaching examples are intentionally simplified. The lever's tilt is illustrative, not a rigid-body simulation.
- Gallery timing is custom animation logic, not a full mechanical simulation. Rendering can slow down on a busy device.
- A hosted URL can depend on the host's access settings. Local `index.html` does not depend on that access.
- The CV is English. Original project screenshots and the embedded Practice Wheel can contain Russian; switching portfolio language does not rewrite them.
- Source assets include supplied Instagram screenshots. Display viewports hide their interface chrome, but the original JPEG bytes remain in the repository.

## Possible next improvements

These are ideas, not completed features or commitments:

- Test touch gestures on several physical Android and iOS devices.
- Add a repeatable browser regression suite and a screen-reader review.
- Offer a lighter web-only build with separately cached photographs.
- Replace screenshot sources with original photo exports when available.
- Move text translation to explicit message keys if the site grows substantially.
