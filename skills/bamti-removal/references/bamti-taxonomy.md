# Bamti Taxonomy

`밤티` is not just ugly UI. It is a low-intent surface that feels assembled from defaults: mismatched structure, generic decoration, weak Korean typography, missing states, fake proof, and unverified responsive behavior.

## Severity

| Severity | Meaning | Examples |
|---|---|---|
| Critical | Do not ship. Breaks trust, accessibility, mobile, or first impression. | unreadable contrast, mobile horizontal scroll, removed focus, invented metric/testimonial, fake chrome as the hero visual |
| Major | Strong AI-generated/template signal. | centered gradient hero, hero + 3 cards + CTA rhythm, Inter/system-only Korean UI, card-in-card clutter, over-animated sections |
| Minor | Craft issue that lowers polish. | weak tabular numbers, tiny label collisions, generic footer labels, hover layout shift |

## Ten Audit Categories

1. Structure/template fingerprint
2. Hierarchy/glance
3. Spacing/grouping/rhythm
4. Korean typography/font routing
5. Color/contrast/token discipline
6. Components/states/forms
7. Motion/microinteraction
8. Visual assets/decoration/chrome/icons
9. Copy/proof/content specificity
10. Responsive/accessibility

## Bamti 25 Gates

Every answer should be "no" before shipping.

1. Does the hero use purple/blue/cyan/magenta gradient as the main personality?
2. Is the hero full-viewport with everything centered?
3. Is the page structurally Hero -> 3 feature cards -> CTA -> footer?
4. Does the nav look like generic SaaS nav regardless of domain?
5. Does the footer use generic Product/Company/Resources/Legal columns without real sitemap need?
6. Is Inter/Roboto/system font used for everything including wordmark/H1?
7. Does any heading use gradient text?
8. Are there nested cards without semantic reason?
9. Are there three equal feature cards with icon above heading?
10. Are raw color values scattered outside tokens?
11. Does the accent cover more than roughly 5% of a viewport?
12. Are pure black/white or flat greys used as base surfaces without deliberate system reason?
13. Does any text/icon/focus ring fail contrast?
14. Does any button text nearly match its fill?
15. Does any interactive element lack focus-visible styling?
16. Do touched components lack active/disabled/loading/error states?
17. Is `transition-all` or universal hover scale used?
18. Does motion lack reduced-motion handling?
19. Is there fake browser/phone/code/IDE chrome?
20. Are emoji used as structural icons?
21. Are multiple icon libraries mixed?
22. Are invented metrics/testimonials/placeholders present?
23. Does any CTA/nav/tab/footer link wrap at 320-414px?
24. Does the page horizontally scroll at 320/375/414/768px?
25. Does the final screen fail a 10-second glance test?

## Korean Signal Mapping

| User signal | Interpret as | Default mode |
|---|---|---|
| 밤티 | tacky, low-intent UI | audit/remove |
| AI 티 나 | AI-generated-looking fingerprint | audit/remove/redesign |
| 템플릿 같아 | structural sameness | redesign candidate |
| 촌스러워, 싸구려 | low credibility/craft | remove |
| 감도 낮아 | weak hierarchy, type, rhythm | audit/remove |
| 한글이 어색해 | Korean typography/copy failure | remove/verify |

