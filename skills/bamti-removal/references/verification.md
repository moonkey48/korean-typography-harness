# Verification

## Required Evidence

- Static checks/build/lint where available.
- Desktop screenshot or browser inspection.
- Mobile widths: 320, 375, 414; tablet 768; desktop 1280 or 1440.
- No horizontal scroll.
- CTA/nav/tab/footer labels do not wrap or overflow.
- Contrast and focus-visible pass.
- `prefers-reduced-motion` path exists when motion exists.
- Touched components have relevant states.
- Removed Bamti tells are listed before/after.

## Harness JSON

When storing a run result, include a `bamti` object:

```json
{
  "mode": "audit|remove|redesign|systemize|verify",
  "authority": "default|confirmed-redesign",
  "removed_tells": [],
  "pending_user_decisions": [],
  "visual_policy": "pass|fail|na",
  "motion_policy": "pass|fail|na",
  "blocking": 0
}
```

## Report Template

```text
Mode: remove
Authority: default, no confirmed full redesign
Removed tells: centered gradient hero, fake proof metric, transition-all
Verification: build pass, 320/375/414/768/1440 checked, axe pass, reduced-motion pass
Remaining risk: brand font license not refreshed
```

