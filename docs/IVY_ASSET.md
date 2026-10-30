# Ivy illustration — processing note

Built-in imagegen was used in edit mode with a transparent background. The existing light-theme illustration is retained unchanged. A transparent sibling is used in the dark theme without the former leaf-hiding CSS mask. The generated PNG was encoded as lossless WebP for the self-contained site.

- Source: `assets/illustrations/pixel-scene-03.webp`
- Final project asset: `assets/illustrations/hero-ivy-transparent.webp`
- Preview PNG: [Hero-Ivy-Transparent.png](Hero-Ivy-Transparent.png)

## Prompt

Use case: background-extraction. Edit target: the supplied existing portfolio illustration. Remove ONLY the flat cream/off-white outside background surrounding the pixel-art scene, including blank cream space at the left and underneath the trailing vines. Replace it with true transparent alpha. Preserve the complete pixel-art scene and its original composition: Andres with long brown hair, glasses, black striped hoodie at desk, cat, lamp, mug, books, forest window and ALL trailing ivy leaves on the left and below. Keep detached decorative pixel fragments, delicate leaf edges, identity, colors, lighting, and aspect ratio. Do not crop out ivy; do not redraw/reinterpret the person or add anything. Keep cream-colored objects INSIDE the scene such as the notebook, mug highlights and hoodie stripes opaque. Actual transparent background, no checkerboard pattern drawn into the image. This is a faithful background removal, not a new illustration.
