# Hangul Typography

Use this reference when the task involves Korean UI layout, CSS typography, readability, line breaks, mixed Korean-English text, or visual polish.

## Source Baseline

- W3C KLReq: Requirements for Hangul Text Layout and Typography, https://www.w3.org/TR/klreq/
- W3C WCAG 2.2: accessibility requirements for contrast, spacing, focus, labels, and target size, https://www.w3.org/TR/WCAG22/
- Pretendard: Korean/multilingual UI font with variable font and dynamic subset support, https://github.com/orioncactus/pretendard
- Naver Hangeul fonts: Korean font families and license information, https://hangeul.naver.com/font

## Practical Rules

- Use a Korean-capable UI font stack. Prefer an installed project font; otherwise consider `Pretendard`, `"Noto Sans KR"`, `"Apple SD Gothic Neo"`, `"Malgun Gothic"`, `system-ui`, `sans-serif`.
- Hangul needs more vertical air than many Latin-only UI comps. Body copy often works around `line-height: 1.45-1.65`; compact labels and buttons can be tighter but must not clip glyphs.
- Do not judge Korean text fit from English strings. Korean can look visually dense even with fewer characters.
- Avoid negative letter spacing for Korean UI text unless there is a clear brand reason and the rendered result was checked.
- Use stable widths for buttons, tabs, chips, and table cells so Korean labels do not shift layout on hover, loading, or state change.

## Line Breaking

- Headings, buttons, tabs, nav items, and short labels usually benefit from `word-break: keep-all` so Korean words do not break awkwardly.
- Long body copy can use normal wrapping, but check mobile line lengths and avoid cramped ragged lines.
- Pair Korean wrapping rules with overflow protection for URLs, emails, hashes, and English identifiers:

```css
.ko-copy {
  word-break: keep-all;
  overflow-wrap: break-word;
}

.technical-token {
  word-break: break-all;
}
```

- Use `text-wrap: balance` only for headings where browser support and fallback are acceptable.
- Prevent orphaned units and short groups where possible: `10초`, `3개`, `API 키`, `결제 ID`, `v1.2.0`.

## Mixed Korean-English UI

- Keep product/API names stable, but remove unnecessary English filler. Prefer "API 키 만들기" over "Create API Key 하기".
- Check baseline and weight balance between Hangul, Latin acronyms, and numbers. Mixed text often needs a better font stack or weight choice.
- For metric-heavy UI, use `font-variant-numeric: tabular-nums` where alignment matters.
- Be consistent with spacing around English terms. Prefer project style, then apply it everywhere.

## Visual QA Signals

- Korean text feels too dark because weight is too heavy or line-height is too tight.
- Fallback font appears in only some glyphs, causing uneven rhythm.
- Buttons wrap to two lines while neighboring buttons stay one line.
- Tables are technically aligned but Korean labels are too wide to scan.
- Mobile cards show one Korean word per line due narrow columns.
- English placeholder copy was translated literally and now needs more space.
