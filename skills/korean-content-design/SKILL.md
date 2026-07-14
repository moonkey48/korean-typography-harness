---
name: korean-content-design
description: Use for Korean-language UI/content design quality, Hangul typography, Korean UX writing, localization review, Korean-English mixed text, Korean layout QA, Korean buttons/forms/errors/empty states, and any frontend/design task where Korean text must feel natural, readable, and visually polished.
---

# Korean Content Design

Use this skill when Korean content quality is part of the product experience. It complements `$hallmark-design`: run Hallmark for overall visual taste, then run this skill for Hangul typography, Korean microcopy, and Korean-specific layout failure modes.

## Single source of truth for exact numbers (SSOT)

This skill owns **Korean UX writing, tone, and content-level layout judgment**. It does **not** own the exact numeric rules — those live in the **`korean-design-foundation`** skill, which is the single source of truth (SSOT) for Korean typography/spacing/color/contrast/touch numbers, the design-type rule matrix, component slots, and the master QA checklist.

**Rule: never invent Korean numeric values here — cite the foundation.**
- For any exact number (body px, line-height, tracking, spacing scale, breakpoints, contrast ratios, touch targets, chart-series limits, table rules, ChartCard 6-slot / KpiCard 4-slot), read and cite the `korean-design-foundation` skill.
- It is installed alongside this skill in the shared hub. Reference paths (siblings under `~/.agents/skills/`):
  - Rules & tokens: `../korean-design-foundation/references/tokens.dtcg.json`
  - Design-type × rule matrix (wins on any type conflict): `../korean-design-foundation/references/design-type-matrix.md`
  - Component slots: `../korean-design-foundation/references/component-slots.md`
  - Master QA checklist: `../korean-design-foundation/references/qa-checklist.md`
- When exact-number enforcement / regression is needed (lint, axe, contrast, zoom), hand off to the **`korean-design-checks`** skill (it runs the foundation's 11-item checklist as blocking gates). This skill stays copy/typography-taste; `korean-design-checks` is the numeric gate.
- If those siblings are not on disk (older install), state that the foundation SSOT is the authority and use its published numbers rather than guessing.

## Workflow

1. Identify the surface:
   - Product UI, landing page, dashboard, form, table, mobile screen, slide/deck, modal, or error state.
   - Dense work UI should prioritize scanability and precision; landing/editorial UI can use more expressive hierarchy.

2. Load only the relevant reference:
   - Read [hangul-typography.md](references/hangul-typography.md) for type, line breaking, spacing, mixed-script layout, and CSS.
   - Read [korean-ux-writing.md](references/korean-ux-writing.md) for labels, buttons, empty states, errors, confirmations, and variable grammar.
   - Read [font-and-layout-checklist.md](references/font-and-layout-checklist.md) before final UI QA or when editing CSS/components.

3. Inspect the actual artifact:
   - Prefer screenshots, DOM/CSS, source copy, component files, or rendered pages over abstract advice.
   - Check representative Korean strings, long labels, mixed Korean-English text, numbers, units, and variable interpolation.

4. Apply a Korean content pass:
   - Fix unnatural translation tone, inconsistent politeness, vague button labels, awkward variables with particles, and unclear next actions.
   - Check Hangul line-height, wrapping, text density, button/control fit, table alignment, mobile overflow, and fallback fonts.

5. Verify:
   - For implementation tasks, render desktop and mobile when possible.
   - Use long Korean text samples for stress testing, not only short happy-path labels.
   - Report remaining risk if visual verification is unavailable.

## Output

For reviews, lead with concrete findings:

`Issue | Fix | Rationale | Where`

For implementation, report:

- files changed
- Korean typography/content rules applied
- visual or textual verification completed
- remaining Korean-content risk
