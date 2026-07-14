---
name: korean-design-tokens
description: 한글 디자인 토큰을 셋업하거나, Tailwind theme를 구성하거나, 멀티플랫폼(웹/iOS/Android) 토큰을 빌드할 때 사용. DTCG(foundation)를 단일 진실 공급원(SSOT)으로 삼아 Tailwind preset · CSS 변수 · SCSS mixin · Style Dictionary 산출물을 만든다. "토큰 셋업", "Tailwind 한글 테마", "디자인 토큰 빌드", "px/hex 하드코딩 정리", "멀티플랫폼 토큰"을 요청하면 반드시 이 스킬을 쓴다. 토큰 값(크기·색·간격)을 여기서 새로 정하지 말 것 — 값은 foundation에서만 온다. 컴포넌트/레이아웃을 직접 그리는 일(그건 korean-web-layout·korean-design-apply)이나 규칙 수치의 근거를 묻는 일(그건 korean-design-foundation)에는 이 스킬을 쓰지 않는다. 색공간 변환(oklch/hsl↔hex, 팔레트·gamut·감마 계산)은 oklch-skill 소관이며, 이 스킬은 foundation의 확정된 색값을 토큰화·배포만 한다.
---

# Korean Design Tokens — DTCG를 다중 산출물로 빌드

이 스킬은 **토큰 엔지니어링 도구**다. 한국어 UI의 정본 토큰(`korean-design-foundation`의 DTCG)을 받아
**Tailwind preset · CSS 변수 · SCSS mixin · Style Dictionary 멀티플랫폼** 산출물로 변환한다.
`korean-token-engineer` 에이전트가 이 스킬을 사용한다.

**근거(SSOT):** 모든 수치는 아래에서만 온다. 값을 지어내지 않는다.
- `../korean-design-foundation/references/tokens.dtcg.json` — 정본 DTCG (최종 근거)
- `../korean-design-foundation/SKILL.md` — 6대 원칙 + Quick Reference
- `../korean-design-foundation/references/type-scale.md` · `spacing-grid.md` · `color-contrast.md`

## 왜 DTCG를 SSOT로 두는가

토큰을 Tailwind config에 직접 써 넣으면, iOS·Android·문서·차트가 각자 다른 숫자를 갖게 된다.
한글 화면이 촌스러워지는 첫 번째 원인은 취향이 아니라 **값의 표류(drift)** — 같은 "본문"이 화면마다
16px·17px·15px로 갈라지는 것이다. 그래서 **하나의 DTCG 파일이 원본이고, 나머지는 전부 파생물**이다.
값을 바꿔야 하면 DTCG를 고치고 다시 빌드한다. 이 스킬의 산출물은 절대 손으로 편집하지 않는다.

```
tokens.dtcg.json (foundation, SSOT)
        │  korean-design-tokens 가 변환
        ├─→ tailwind.preset.js   (React + Tailwind 웹)
        ├─→ tokens.css           (:root 변수 — 프레임워크 무관)
        ├─→ _mixins.scss         (SCSS 파이프라인)
        └─→ Style Dictionary ──→ build/{css,scss,js,ios,android}
```

## 산출물과 사용법

이 스킬은 `assets/`에 **즉시 동작하는** 산출물을, `scripts/`에 빌드 스크립트를 제공한다.
정적 산출물(preset·css·scss)은 DTCG 값을 미리 반영해 두었으니 복사해서 바로 쓰고,
값이 바뀌거나 iOS/Android가 필요하면 Style Dictionary로 재생성한다.

### 1) Tailwind preset — `assets/tailwind.preset.js`

React + Tailwind 프로젝트의 `tailwind.config.js`에서 preset으로 불러온다.

```js
// tailwind.config.js
module.exports = {
  presets: [require("./tailwind.preset.js")],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
```

이후 예시 코드는 아래 유틸 이름을 **그대로** 쓴다 (재발명 금지).

### 2) CSS 변수 — `assets/tokens.css`

Tailwind를 안 쓰는 화면(순수 CSS·바닐라·서드파티 위젯·이메일 등)에서 `import` 한다.
`:root`에 `--fs-*`(크기) `--lh-*`(줄간격) `--ls-*`(자간) `--sp-*`(간격) 색·radius 변수가 정의되어 있다.

### 3) SCSS mixin — `assets/_mixins.scss`

SCSS 파이프라인에서 `@use`. `type(body)` / `type(title)` 같은 타입 mixin과
한글 행 길이를 지키는 `page-copy()` mixin을 제공한다.

### 4) 멀티플랫폼 빌드 — `scripts/build-tokens.sh` + `assets/style-dictionary.config.json`

foundation의 DTCG를 source로 Style Dictionary가 `build/`에 CSS·JS(+d.ts)·iOS(Swift)·Android(xml)를
생성한다. iOS/Android 팀에 토큰을 넘기거나, DTCG를 고친 뒤 전 플랫폼을 다시 맞출 때 실행한다.

```bash
bash scripts/build-tokens.sh
# → build/css/tokens.css, build/scss/_tokens.scss, build/js/tokens.js(.d.ts),
#   build/ios/KoreanDesignTokens.swift, build/android/{colors,dimens}.xml
```

## Tailwind 유틸 네이밍 규약 (고정)

preset은 아래 이름으로 theme를 확장한다. 예시 코드·리뷰는 **이 이름만** 쓴다.
크기 유틸에는 줄간격·자간이 이미 묶여 있으니, `text-title` 하나로 24px·1.45·0em이 함께 적용된다.

| 목적 | 유틸 | 값(DTCG) |
|---|---|---|
| 타입(크기+줄간격+자간) | `text-caption` | 13px / 1.45 / 0em |
| | `text-label` | 14px / 1.45 / 0em |
| | `text-body` | 17px / 1.6 / 0em |
| | `text-body-dense` | 15px / 1.5 / 0em |
| | `text-title` | 24px / 1.45 / 0em |
| | `text-headline` | 32px / 1.4 / 0em |
| | `text-display` | 44px / 1.3 / 0em |
| 자간(수동, 검수 후 예외) | `tracking-tight` | -0.01em |
| | `tracking-tighter` | -0.015em |
| | `tracking-normal` | 0 (기본) |
| 간격 | `p-4 p-8 p-12 p-16 p-24 p-32 p-40 p-48 p-64` (m·gap도 동일) | 숫자 = px |
| 색(텍스트) | `text-primary` / `text-secondary` / `text-tertiary` | #111111 / #4B5563 / #6B7280 |
| 색(배경) | `bg-surface` / `bg-surface-muted` / `bg-surface-elevated` | #FFFFFF / #F7F8FA / #FFFFFF |
| 색(차트) | `text-chart-1..4` `fill-chart-1..4` `stroke-chart-focus` `text-chart-muted` | 아래 색 섹션 |
| 반경 | `rounded-sm` / `rounded-md` / `rounded-lg` | 8 / 12 / 16px |

> 주의: `spacing`은 **숫자 = px**로 재정의된다. 이 preset에서 `p-4`는 4px(기본 Tailwind의 1rem이 아님).
> 4·8·12·16·24·32·40·48·64 외의 임의 여백은 쓰지 않는다 — 어색함의 대부분은 서체가 아니라 spacing에서 온다.

## raw px / hex 금지 — 토큰 참조 강제

컴포넌트·페이지 코드가 `font-size:15px`, `color:#333`, `margin:10px`처럼 값을 직접 쓰면
DTCG를 고쳐도 그 지점은 따라오지 않는다. 그래서 **모든 시각 결정은 토큰을 통과**해야 한다.

- 나쁨: `<p style={{ fontSize: 17, lineHeight: 1.6, color: "#111" }}>`
- 좋음: `<p className="text-body text-primary">`
- 나쁨(간격): `className="mt-[10px] p-[13px]"` (임의값 대괄호)
- 좋음: `className="mt-8 p-16"`

예외는 하나뿐이다: **회색 본문 금지.** `text-tertiary`(#6B7280)는 캡션·비활성 전용이며 본문에 쓰지 않는다
(대비 미달·촌스러움의 주범). 본문은 `text-primary`, 보조는 `text-secondary`까지만.

색(차트) 값: `chart-1` #2563EB · `chart-2` #059669 · `chart-3` #D97706 · `chart-4` #7C3AED ·
`chart-focus` #2563EB · `chart-muted` #9CA3AF. categorical은 4색까지만, focus 1개로 강조, 나머지는 저채도.
Recharts에서는 `fill`/`stroke` prop에 이 토큰(또는 `var(--color-chart-1)`)을 넘겨 색을 코드에 하드코딩하지 않는다.

## 세 가지 작업 모드

토큰 스킬도 세 모드로 동작한다. 어느 모드든 **값의 출처는 언제나 DTCG**다.

### 생성 (새 프로젝트에 토큰 셋업)
1. `assets/tailwind.preset.js`를 프로젝트로 복사하고 `tailwind.config.js`의 `presets`에 등록.
2. Tailwind 밖 표면이 있으면 `assets/tokens.css`를 전역에 import, SCSS면 `_mixins.scss`를 `@use`.
3. Pretendard 로드(`@fontsource/pretendard` 또는 CDN, `font-display: swap`). font stack은 DTCG `font.family.sans`.
4. iOS/Android도 대상이면 `scripts/build-tokens.sh`로 네이티브 산출물까지 생성.

### 변환 (외국·기존 코드 → 한글 토큰)
외국 템플릿은 보통 본문 14~16px·자간 +tracking·불규칙 여백을 쓴다. 한글에 맞게 **매핑**한다.
1. 기존 스케일을 정본 역할로 흡수: 14/16px 본문 → `text-body`(17px), 표는 `text-body-dense`(15px).
2. 본문·라벨 자간을 0으로 되돌리고, 제목의 비영 자간은 서체 기준과 렌더링 검수로 입증된 경우에만 제한적으로 둔다.
3. raw hex를 시맨틱 토큰으로 치환: `#333`류 회색 본문 → `text-primary`, 배경 회색 → `bg-surface-muted`.
4. 임의 여백(10px·18px 등)을 가장 가까운 4/8 스케일 토큰으로 스냅.
5. 긴 본문 블록에 `page-copy()`(SCSS) 또는 max-width 유틸을 붙여 한글 24~34자 행 길이를 회복.

### 검수 (규칙 대비 리뷰 → 데이터로 반환)
값이 아니라 **위반**을 찾는다. 발견은 사람에게 보내는 문장이 아니라 구조화 데이터로 반환한다.
- raw px/hex 직접 사용, Tailwind 임의값 대괄호(`p-[10px]`, `text-[#333]`).
- 본문 16px 미만(예외: dense table 15px만 허용), 본문 line-height 1.5 미만.
- 본문/라벨 non-zero tracking, 과대 letter-spacing, 회색 본문(`text-tertiary`를 본문에 사용).
- 유틸 네이밍 규약 위반(`text-title`이 아니라 임의 크기), 4/8 스케일 밖 여백.
- 상세 판정 기준은 `../korean-design-foundation/references/qa-checklist.md`를 근거로 삼는다.

## 반환(return) — MANIFEST

작업 결과는 데이터로 반환한다: 생성/수정한 파일의 **절대경로 전체**, 예시·설정에서 실제로 사용한
**토큰·유틸 이름**, 그리고 가정·계약과 다르게 처리한 부분을 담은 **notes**. 사람용 인사말은 넣지 않는다.
