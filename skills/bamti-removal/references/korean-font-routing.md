# Korean Font Routing

Use this when Bamti is partly caused by Korean typography. Exact size, line-height, spacing, contrast, and touch numbers come from `korean-design-foundation`; this file only chooses role packages.

## Input

- user signal: AI티, 촌스러움, 신뢰감, 차트, 브랜드감, 공공/문서, 따뜻함, 제작 도구
- screen type: product UI, dashboard, chart, landing, public/doc, community/education, image studio
- current font problem: system-only, no Korean fallback, single font for every role, decorative body, display font in data/form controls
- constraints: existing brand font, license, CDN/source availability, offline needs

## Routes

| Route | Use when | Package |
|---|---|---|
| `utility` | AI-looking default product UI | Wanted Sans / Pretendard / SUIT body-display |
| `trust` | cheap, dated, medical, billing, public-service trust | SUIT / Wanted Sans / KoPubWorld Dotum |
| `data` | analytics, charts, metrics, experiment review | IBM Plex Sans KR / Spoqa Han Sans Neo / D2Coding |
| `brand` | generic landing needs restrained identity | Pretendard/SUIT body + Paperlogy/Freesentation display |
| `campaign` | explicit promotion/event only | Gmarket Sans / The Jamsil / S-Core Dream display only |
| `editorial` | reports, story, reading surfaces | Noto Serif KR / MaruBuri / KoPubWorld Batang with UI sans |
| `warmth` | education, community, guidance | Gowun Dodum / Gowun Batang / Nanum Gothic |
| `production` | image studio, prompt, asset tool | LINE Seed KR / Wanted Sans / D2Coding |

## Rules

- Preserve an existing brand font unless there is evidence that it causes the Bamti tell.
- Import only from verified CDN or official source, with system fallback.
- Use `--font-body`, `--font-display`, `--font-data`, `--font-mono`; do not hardcode stacks in components.
- Keep display fonts out of body, form labels, tables, and chart labels.
- After applying, verify 320/375/414 wrapping, CTA/nav wrapping, fallback behavior, and tabular numeric stability.

