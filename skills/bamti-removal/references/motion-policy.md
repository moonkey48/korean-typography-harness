# Motion Policy

Apple-like motion means continuity, calm timing, and clear state feedback. It does not mean constant animation.

## Defaults

- Animate only `opacity` and `transform`.
- Use short, eased transitions for state changes. Avoid bounce unless the brand is explicitly playful.
- Page-level motion gets at most one signature moment per page.
- `prefers-reduced-motion` is mandatory.
- Hero content must be readable immediately; do not gate comprehension behind animation.

## Hard Blocks

- `transition-all`
- universal `hover:scale-*` on cards
- animated focus rings
- auto carousels without pause
- every-section scroll fade-up
- cursor follower dots
- layout-affecting animation of width, height, top, left, margin, padding, grid, or box-shadow

## Verification

- Check reduced-motion path.
- Check no layout shift from entrances.
- Check mobile does not use heavy parallax or pinned scroll unless explicitly required and tested.
- Keep motion primitive count small: state transition, one entrance/reveal, one signature continuity motion.

