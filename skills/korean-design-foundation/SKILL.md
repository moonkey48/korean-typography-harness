---
name: korean-design-foundation
description: 한국어 UI 디자인의 단일 진실 공급원(SSOT). 한글 타이포·간격·색·대비·터치·행길이의 정확한 수치와 그 근거(why), DTCG 토큰, 디자인 유형별 규칙 매트릭스, 컴포넌트 슬롯, 마스터 검수 체크리스트를 담는다. 한글/한국어 UI의 "정답 수치"가 필요하거나, 다른 한글 디자인 스킬·에이전트가 규칙을 조회할 때 반드시 이 스킬을 근거로 삼을 것. 본문 크기·줄간격·자간·spacing·breakpoint·컬럼·차트 규칙·표 규칙·대비 기준을 물으면 여기서 답한다.
---

# Korean Design Foundation — 한국어 UI 규칙의 SSOT

이 스킬은 **규칙 저장소**다. 코드를 생성하거나 검수하지 않는다. 대신 모든 한글 디자인 결정이 통과해야 하는 **정확한 수치와 근거**를 제공한다. `korean-design-apply`, `korean-web-layout`, `korean-dataviz`, `korean-proposal-slides`, `korean-design-tokens`, `korean-design-checks` 스킬과 모든 `korean-*` 에이전트는 이 파일과 `references/`를 근거로 판단한다.

**출처:** 레포 루트의 `docs/deep-research-report.md` (KRDS, WCAG, Material, Apple HIG, Baymard, Government Analysis Function 종합). 표 안의 수치는 "정책 숫자"가 아니라 **팀 표준 숫자** — KRDS 하한/권장값을 한국어 밀도에 맞춰 실무 보정한 값이다.

## 왜 한글은 다른가 (근본 원리)

외국 템플릿이 한글에서 어색한 이유는 취향이 아니라 **문자 구조** 때문이다. 한글은 네모꼴 음절 블록이 연속되어 라틴보다 **줄 밀도가 빨리 높아진다**. 그래서 같은 명목 크기라도 더 크게, 더 여유 있게, 더 규칙적으로 다뤄야 한다. 이 원리를 이해하면 표에 없는 엣지 케이스도 올바르게 판단할 수 있다.

## 6대 원칙 (each with why)

1. **작지 않게.** 본문은 **16~17px에서 시작**한다. KRDS는 본문 최소 16px, Pretendard GOV는 상대적으로 작게 보여 기본 17px을 쓴다. 한글은 14~16px 라틴 본문을 그대로 옮기면 금방 답답해진다. 정보 밀도 높은 화면만 15px로 내린다.
2. **줄간격은 여유 있게.** 본문 **line-height ≥ 1.5**, 실무 표준 본문 1.55~1.6, 긴 문장 1.6~1.7, 디스플레이급 제목 1.3~1.45. 한글은 1.5 아래로 내려가면 시각적 쌓임이 빨라져 표·카드·설명문에서 피로가 커진다.
3. **자간은 기본 0.** 본문·라벨·네비·UI = **0em**. 제목·디스플레이도 기본값은 **0em**이며, 비영(非0) 자간은 프로젝트 서체 기준이나 렌더링 검수로 입증된 짧은 제목에서만 제한적으로 쓴다. 한글은 음절 블록이 이미 분명하므로 전역 자간 조정은 쉽게 어색해진다.
4. **빈 공간은 규칙적으로.** 느낌이 아니라 **4px 서브그리드 + 8px 매크로 스케일**. 간격은 4·8·12·16·24·32·40·48·64에서만 고른다. 어색함의 대부분은 서체가 아니라 spacing에서 온다.
5. **계층은 한눈에.** heading:body = **1.25~1.5배**. 미세한 차이의 여러 스타일은 나쁘다. 역할은 Display / Heading / Title / Body / Label / Caption로 고정하고 실제 프로젝트에선 6~8개 토큰 이내로 쓴다.
6. **색보다 구조 먼저.** 대비는 일반 텍스트 4.5:1, 큰 텍스트 3:1, 비텍스트 그래픽 3:1. 색은 장식이 아니라 **정보 구조의 마지막 보정 장치**다. 과한 accent·채도·낮은 대비 회색 본문이 한국어 화면을 가장 쉽게 촌스럽게 만든다.

## Quick Reference — 타입 스케일 (기본값)

| 역할 | size | line-height | tracking | weight |
|---|---|---|---|---|
| caption | 13px | 1.45 | 0em | 400 |
| label | 14px | 1.45 | 0em | 500 |
| body | **17px** | 1.6 | 0em | 400 |
| body-dense | 15px | 1.5 | 0em | 400 |
| title | 24px | 1.45 | 0em | 700 |
| headline | 32px | 1.4 | 0em | 700 |
| display | 44px | 1.3 | 0em | 700 |

**Font stack:** `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif`

## Quick Reference — 간격 · 그리드 · 색

- **Space scale (px):** 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64
- **Breakpoints:** sm 360 · md 768 · lg 1024 · xl 1280 · xxl 1440
- **Grid (KRDS):** small 4–6 컬럼 / medium 8–12 / large 12–16. 마진 small 16px, medium+ 24px. 거터 최소 16px·권장 24px.
- **Color:** text.primary `#111111` · secondary `#4B5563` · tertiary `#6B7280` / surface.default `#FFFFFF` · muted `#F7F8FA`
- **Contrast:** 일반 4.5:1 · 큰 텍스트 3:1 · 비텍스트 그래픽 3:1
- **Touch target:** iOS 44pt · Android 48dp (이하로 내리지 않음)
- **행 길이(한국어):** 한글 24~34자 / 혼합 45~65자 (라틴 50~75자를 짧게 보정)

## references/ — 상세 조회 (필요할 때만 로드)

각 상황에서 아래 파일을 읽는다. SKILL.md만으로 판단이 서면 굳이 열지 않는다 (컨텍스트 절약).

- **`references/design-type-matrix.md`** — 디자인 유형별(제안서·차트·표·랜딩·대시보드·웹앱·모바일앱) 완전한 수치표 + 차트/표/대시보드 예외 규칙 + 유형별 "흔한 실패". *어떤 유형에 어떤 값을 쓸지 정할 때 반드시 조회.*
- **`references/type-scale.md`** — 타이포 상세, 유형별 body/title 조정, heading:body 비율 근거.
- **`references/spacing-grid.md`** — 4/8 스케일, 컬럼/거터/마진, breakpoint별 레이아웃, 반응형 전환 규칙.
- **`references/color-contrast.md`** — 색 시맨틱, WCAG 대비, 차트 색 팔레트 원칙, 다크모드 방향.
- **`references/component-slots.md`** — Page/Section Header, Body Block, KPI Card, Chart Card, Table Wrapper 등 텍스트 슬롯 정의. *컴포넌트 구조를 만들 때 조회.*
- **`references/korean-forms.md`** — 휴대폰·주소·사업자번호·생년월일·본인인증·이메일/비밀번호 폼 도메인 규칙 + 마크업 힌트 + 검증 실패 카피. *폼 필드를 만들 때 조회.*
- **`references/korean-number-date-units.md`** — 숫자(만/억 그루핑)·통화·날짜·시간·단위 표기 정본 + 동적 조사 헬퍼. *숫자·통화·날짜·시간·단위 표기를 정하거나 동적 조사(을/를·이/가 등)를 처리할 때 조회.*
- **`references/usability-heuristics.md`** — Nielsen 10 휴리스틱의 웹/B2B 적용 규칙 + 합격/불합격 예시 + 자동화 플래그. *사용성 판정 근거가 필요할 때 조회.*
- **`references/qa-checklist.md`** — 마스터 검수 체크리스트 (숫자 기준 + 검사 도구 + 통과/실패). *검수·리뷰 모드에서 조회.*
- **`references/tokens.dtcg.json`** — 정본 DTCG 토큰. `korean-design-tokens`가 여기서 Tailwind/CSS/Style Dictionary 산출물을 생성. *토큰 수치의 최종 근거.*

## 이 SSOT를 쓰는 법 (다른 스킬/에이전트용)

1. 값이 필요하면 **먼저 여기서 찾는다.** 임의로 지어내지 않는다.
2. 유형별 차이가 있으면 `design-type-matrix.md`가 우선한다 (예: 제안서 본문 18pt vs 웹 17px).
3. 값을 코드로 낼 때는 raw px/hex가 아니라 **토큰 참조**로 낸다 (`korean-design-tokens` 참조).
4. 규칙 충돌 시 삭제하지 말고 **출처를 병기**하고 유형 매트릭스를 기준으로 택한다.
5. 표에 없는 상황은 "6대 원칙"과 "왜 한글은 다른가"로 일반화해 판단한다 — 오버피팅 금지.
