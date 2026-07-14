# Visual Asset Policy

Hero and section visuals must not be faked with decorative HTML/CSS graphics. The goal is not "more decoration"; the goal is visual evidence, brand-specific material, or a verified rendering system.

## Allowed

- Real product screenshots, captured flows, owned photography, or brand assets with provenance.
- `brand-image-pipeline` output: reference-driven generation, mandatory post-processing, on-brand checklist, raw/final separation.
- `hero-visual-art-direction` decision board for hero composition, headline zone, crop, contrast, and mobile fallback.
- Three.js, Canvas, chart libraries, map libraries, or other domain-specific rendering libraries when the visual is data/scene/tool output.
- Simple UI primitives, icons from the project icon library, borders, dividers, and layout surfaces.

## Not Allowed

- CSS/SVG orbs, blobs, auroras, bokeh, abstract decorative particles, fake 3D shapes, fake phone/browser/IDE chrome.
- Raw generated images without post-processing and provenance.
- Stock-like photos that do not answer why they belong to this product.
- Visuals that carry the hero because the copy/hierarchy is weak.

## Gate

Before adding a visual, answer:

1. What job does it do: proof, product inspection, mood, navigation, data, or feedback?
2. What source creates it: real asset, brand-image-pipeline, Three.js/Canvas/library, or icon library?
3. Does the UI still work if it is removed?
4. Can it pass contrast, performance, mobile crop/removal, and reduced-motion checks?

If any answer is weak, stay typography-first or use the real content itself.

