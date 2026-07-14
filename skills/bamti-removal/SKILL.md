---
name: bamti-removal
description: "Remove Bamti design traits from Korean web/app UI: tacky, AI-generated-looking, template-like, overdecorated, low-intent Korean typography, generic SaaS layouts, fake proof, fake chrome, unsafe motion, or CSS-drawn decorative graphics. Use when the user says 밤티, AI 티, 촌스러워, 템플릿 같아, 감도 낮아, 싸구려, 한글 디자인 개선, 한국어 UI 다듬기, remove AI slop, or asks to audit/fix visual taste, hierarchy, layout, font, copy, motion, responsive quality, or component states while preserving product intent."
---

# Bamti Removal

Remove low-intent visual decisions from Korean UI while preserving product intent. Replace generic polish with structural specificity, Korean typography discipline, content triage, complete states, restrained motion, and verified responsive quality.

## Mode Decision

- `audit`: inspect only. Do not edit. Use for "어디가 밤티야", "리뷰", "AI 티 나는지 봐줘".
- `remove`: patch the highest-impact tells while preserving the current information architecture.
- `redesign`: restructure when the root cause is a template fingerprint. Layout changes, element removal, font replacement, and copy rewrite are allowed only after listing the candidates and getting user confirmation.
- `systemize`: align multiple screens through tokens, typography roles, spacing, component states, and motion policy.
- `verify`: prove the UI passes Bamti, Korean design, accessibility, responsive, and motion gates.

If the user does not name a mode, infer it from the request. If a destructive or broad redesign decision is needed, pause after the audit and ask only for the high-impact decision.

## Workflow

1. **Pre-flight the actual artifact.** Inspect framework, routes/screens, styling system, tokens, fonts, icon libraries, motion libraries, rendered screenshots, and current copy. Do not make style decisions from names alone.
2. **Lock intent.** Identify audience, primary job, primary action, domain tone, content that must stay true, and information that may be removed or demoted. For missing details, infer and record the assumption unless removal or structural rewrite would be expensive.
3. **Run content triage.** Separate required facts, optional proof, decorative copy, invented claims, redundant sections, and risky deletions. Ask the user only about risky removals or full layout replacement.
4. **Audit named tells.** Use `references/bamti-taxonomy.md` and `references/audit-rubric.md`. Every finding must include symptom, why humans read it as Bamti, and the fix.
5. **Choose the fix route.** Use `references/fix-recipes.md`. Remove decoration before adding decoration. Fix structure before color. Lock tokens before component-local values.
6. **Apply Korean font routing when typography is involved.** Use `references/korean-font-routing.md`; exact size/spacing/contrast numbers still come only from `korean-design-foundation`.
7. **Apply visual and motion policy.** Use `references/visual-asset-policy.md` and `references/motion-policy.md`. Do not draw hero/section graphics as HTML/CSS decoration.
8. **Verify.** Use `references/verification.md`, `korean-design-checks`, and the design-harness G1-G4 gates. Report what was verified and what remains unverified.

## Authority Model

Default authority is conservative execution with explicit escalation:

- Allowed without confirmation: token cleanup, spacing/radius/shadow normalization, Korean font stack repair, contrast/focus/state fixes, generic copy tightening, mobile overflow repair, motion reduction.
- Requires confirmation: full layout replacement, removing user-visible sections, deleting proof/metrics/testimonials, replacing brand fonts, changing primary CTA, changing the product narrative.
- Never allowed: inventing metrics, logos, testimonials, compliance claims, customer names, or fake screenshots; shipping raw generated imagery; adding decorative CSS orbs/blobs/auroras; using `transition-all`; removing focus styles.

## Reference Routing

- Read `references/bamti-taxonomy.md` for severity, named tells, and the Bamti 25 gates.
- Read `references/audit-rubric.md` for review format and content triage.
- Read `references/fix-recipes.md` before editing.
- Read `references/korean-font-routing.md` when font choice or Korean type roles are part of the issue.
- Read `references/visual-asset-policy.md` before adding hero/section visuals.
- Read `references/motion-policy.md` before adding page or state motion.
- Read `references/verification.md` before final reporting.

## Output Contract

For audit mode, lead with findings:

`Severity | Location | Symptom | Human read | Fix | Confirmation needed`

For implementation, report:

- mode and authority used
- major tells removed
- files changed
- verification completed
- remaining risky decisions or unverified checks

