# Development story

This is a retrospective of the decisions made while developing the portfolio. The stages below come from the design and implementation process; they are not a fabricated Git commit history.

## 1. Start with a story, rather than a list of tools

The original brief was to show the main skills from my CV through an interactive portfolio. SQL, API diagnostics and explaining difficult ideas needed to become visible actions. The opening scenario follows a fictional order that cannot be dispatched because its warehouse mapping is missing.

The intended sequence was established early: table → SQL evidence → API error → fix → successful retry. A single visual thread carries the evidence through the sequence while the explanatory text changes behind it.

## 2. Find a visual direction that feels personal

Early dark-blue, glossy 3D directions were rejected. They did not connect with my personality or the imagery from my projects and writing channel.

The design moved towards paper, warm cream, muted green and terracotta. Large editorial type and simple interface panels make the technical content approachable. Pixel-art scenes, my illustrated character, tea, plants and quiet interiors connect the professional story with my personal interests.

Depth remains useful for movement and focus. It is used selectively rather than turning the whole page into a 3D scene.

## 3. Strengthen continuity during scrolling

An early implementation relied too much on separate appearances. The feedback was specific: the table should travel from the first screen, rotate, reorganize into a query and keep following the viewer.

The final journey uses a persistent moving panel and scroll progress to connect the case chapters. Its content moves from the order table to SQL evidence, API failure, a corrected warehouse mapping and a verified `200 OK` result. Chapter controls and a step-through option provide another way to follow the example.

The order numbers, customer names and API incident are sandbox material. They demonstrate an investigation method and do not disclose a real customer case or claim a measured business outcome.

## 4. Make explanation part of the experience

The explanation section grew from one wave demonstration into three selectable examples:

1. **Waves:** changing phase shows how two waves reinforce or cancel each other.
2. **Leverage:** moving a lighter weight farther from the pivot shows why distance matters.
3. **Refraction:** changing the incoming angle shows light bending as it enters water.

The complicated collision-counting example involving digits of π was considered but was not implemented. The selected examples are easier to explain directly through their controls and pictures.

## 5. Describe the personal projects accurately

Mind Garden is an Android application inspired by Buddhist practice, with meditation, journaling and daily check-ins. The garden is its visual setting. It is not presented as a gardening project.

The music section uses the supplied facts: singing in three bands and performing for audiences of more than 150 people. It does not invent recordings or a music catalogue. The Practice Wheel and the Telegram channel provide additional examples of personal projects and writing.

The footer runner adds a small playable detail. Input is scoped to the game so its jump controls do not become a page-wide keyboard shortcut.

## 6. Combine the two designs

The supplied ordinary portfolio and lantern redesign were combined into one page. A lantern button changes the visual mode while preserving the page structure and content. English is the default; Estonian can be selected in the header.

The implementation stores only interface preferences in local storage when available. The site has no account system, analytics service or application database.

## 7. Add photography with a physical rhythm

Photography was previewed as a separate projector concept before being integrated. The approved direction used framed cards travelling around a deck.

The later feedback focused on weight: a photo needed to accelerate, turn edge-on, disappear inward and let the next frame unfold towards the viewer. The final ordinary turn lasts 1.4 seconds, with a tiny damped settling rotation and optional synthesized click. There is no elastic overshoot of the card position.

A strong swipe can queue multiple frames. Their timings increase towards the final frame, producing a gradual stop. All 15 supplied photographs are included, shuffled once per page visit. Instagram screenshot headers are excluded through SVG viewports; the underlying JPEG files remain unchanged.

## 8. Prepare the project for GitHub

The approved single-file portfolio was separated into readable templates, styles, scripts and assets. A small Node.js build reconstructs the self-contained HTML without downloading packages or assets.

English documentation covers the decisions, implementation, controls and known limits. Static checks validate JavaScript syntax, anchors, unique IDs, the 15-photo deck and asset integrity. Browser checks performed during implementation are recorded separately from the automated checks.

## What this project demonstrates

- Turning a broad creative brief into a concrete, reviewable sequence.
- Iterating from specific visual and interaction feedback.
- Presenting technical reasoning with explicit fictional data.
- Combining professional experience and personal work in one coherent site.
- Using AI-assisted development while retaining responsibility for direction, factual content and review.

## 9. Merge the supplied photo-book revision

The next supplied HTML revision replaced the projector with a physical photo-book metaphor, made the SQL/API investigation more explicit and improved small text. These changes were merged into the maintained source, while retaining the complete v2 arcade rather than reverting to the supplied file's old runner. Additional queueing prevents overlapping page turns, and layout changes preserve the current photograph.
