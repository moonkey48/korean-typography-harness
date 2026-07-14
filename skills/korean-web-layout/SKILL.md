---
name: korean-web-layout
description: 웹앱·랜딩페이지·대시보드의 레이아웃/구조/밀도를 한글 규칙으로 결정하고 React+Tailwind로 구현·검수한다. 이럴 때 바로 써라 — "한글 웹앱/관리자 화면/랜딩페이지/대시보드를 만들어줘", "이 영문 레이아웃(부트스트랩/외국 템플릿/피그마 시안)을 한국어에 맞게 바꿔줘", "우리 화면 여백·컬럼·breakpoint·본문 크기·터치영역이 규칙에 맞는지 검수해줘". 페이지 셸·그리드·PageHeader·BodyBlock·섹션 밀도·반응형 전환이 대상이다. 단, 차트/표/KPI 카드 자체의 내부 규칙(시리즈 수·축 라벨·숫자 정렬·6슬롯 ChartCard)은 이 스킬이 아니라 korean-dataviz가 담당하니 그쪽으로 넘긴다. 순수 시각 토큰(색값·폰트·Tailwind theme 산출)은 korean-design-tokens 소관이다.
---

# Korean Web Layout — 한글 웹 레이아웃 결정·구현·검수

웹앱·랜딩페이지·대시보드의 **레이아웃 골격**을 한국어에 맞게 정하고 React + Tailwind로 구현한다. 모든 수치와 근거는 지어내지 않고 SSOT인 **korean-design-foundation**을 따른다:

- `../korean-design-foundation/SKILL.md` — 6대 원칙, 정본 타입 스케일, quick reference
- `../korean-design-foundation/references/design-type-matrix.md` — 유형별 본문/그리드/흔한 실패
- `../korean-design-foundation/references/spacing-grid.md` — 4/8 스케일, breakpoint, KRDS 그리드
- `../korean-design-foundation/references/component-slots.md` — PageHeader/BodyBlock/KpiCard/ChartCard/TableWrapper 슬롯
- `../korean-design-foundation/references/qa-checklist.md` — 검수 기준(PASS/FAIL/N/A)

값이 필요하면 위에서 찾고, 유형 차이가 있으면 `design-type-matrix.md`가 우선한다.

## 이 스킬의 경계 (왜 나누나)

레이아웃과 데이터 표현은 관심사가 다르다. 골격을 잡는 사람과 차트를 튜닝하는 사람이 같은 규칙표를 두 번 관리하면 어긋나기 때문에 역할을 쪼갠다.

- **여기서 한다:** 페이지 셸, 그리드/컬럼, breakpoint 전환, 섹션 간격·밀도, PageHeader/BodyBlock, 본문 크기·행 길이(max-width), 터치 영역, CTA 배치, 회색 남용 점검.
- **korean-dataviz로 넘긴다:** 차트 내부 규칙(시리즈 ≤4, gridline ≤10, 직접 라벨링), 표 규칙(숫자 우정렬·셀 3줄·vertical line 지양), KpiCard/ChartCard/TableWrapper의 **슬롯 내용**. 이 스킬은 그 카드들이 "몇 열로 어디에 놓이는지"까지만 책임진다.
- **korean-design-tokens로 넘긴다:** 색 hex, 폰트 스택, Tailwind `theme` 산출물. 여기서는 그 토큰 유틸 이름만 사용한다.

대시보드를 만들 때는 그리드 셸(이 스킬) → 각 카드 내부(korean-dataviz) 순서로 협업한다.

## 공통 웹 규칙 (모든 유형 공통 하한)

foundation에서 가져온 웹 공통값. 유형별 미세 조정은 references에.

| 항목 | 값 | 왜 |
|---|---|---|
| 본문 | 16~17px (`text-body` 17 / `text-body-dense` 15) | 한글은 네모꼴 블록이라 라틴 14~16을 옮기면 답답. dense 화면만 15. |
| 줄간격 | 본문 ≥1.5 (body 1.6) | 1.5 아래면 한글 줄 쌓임이 빨라 피로 급증. |
| 자간 | 본문·라벨·제목 기본 0em, 비영 자간은 검수된 제목 예외만 | 한글 블록은 이미 분명해서 전역 자간 조정은 쉽게 어색해진다. |
| 간격 | 4·8·12·16·24·32·40·48·64 (`p-*`,`gap-*`) | 4px 서브그리드 + 8px 매크로. 임의 여백이 어색함의 주범. |
| Breakpoint | sm 360 · md 768 · lg 1024 · xl 1280 · xxl 1440 | KRDS/Material 적응형. Tailwind `screens`가 이 값으로 확장됨. |
| 그리드(KRDS) | small 4–6 / medium 8–12 / large 12–16 컬럼, 마진 small 16·medium+ 24, 거터 ≥16(권장 24) | 화면 폭에 맞는 컬럼 수. |
| 행 길이 | 한글 24~34자 / 혼합 45~65자 → BodyBlock `max-width` 필수(예 32rem) | max-width 없으면 넓은 화면에서 행이 길어져 가독성 붕괴. |
| 대비 | 일반 4.5:1 · 큰 텍스트 3:1 · 비텍스트 3:1 | `text-tertiary`(#6B7280)를 본문에 쓰지 않는다. |
| 터치 | iOS 44pt · Android 48dp 이상 (`min-h-[44px]` 등) | 이 하한 밑으로 내리지 않는다. |

**색·간격은 토큰 유틸로:** `text-primary`/`text-secondary`/`text-tertiary`, `bg-surface`/`bg-surface-muted`, `text-caption`~`text-display`, `p-4`~`p-64`. raw px/hex 직접 사용은 피한다.

## 세 가지 작업 모드

이 스킬은 항상 세 모드 중 하나로 동작한다. 요청 문장에서 모드를 먼저 판정한다.

### 모드 1 — 생성 (새로 만듦)

새 화면을 백지에서 만든다.

1. **유형 판정.** 웹앱 / 랜딩 / 대시보드 중 무엇인가 → 해당 reference를 연다 (`references/web-app.md`, `landing.md`, `dashboard.md`).
2. **셸 먼저.** 페이지 컨테이너 max-width, 헤더/사이드/본문 영역, 그리드 컬럼 수를 breakpoint별로 정한다. 내용보다 골격이 먼저다.
3. **본문 크기·행 길이 고정.** 유형 기본 본문값을 `text-body`/`text-body-dense`로 잡고, 긴 텍스트 블록은 BodyBlock으로 감싸 max-width를 준다.
4. **간격은 토큰만.** 섹션 간격은 space.section(40~64), 카드 간격은 16~24에서 고른다.
5. **CTA·터치·대비 점검** 후 컴포넌트를 채운다. 차트/표/KPI 자리는 슬롯만 잡고 내용은 korean-dataviz에 위임.
6. 반환 스키마(아래)로 파일 목록과 사용 토큰을 낸다.

### 모드 2 — 변환 (외국·기존 → 한글)

부트스트랩/외국 템플릿/영문 시안/기존 화면을 한글에 맞게 고친다.

1. 원본에서 **위반 지점을 스캔**한다. 흔한 것: 본문 14px 이하, line-height <1.5, 영문형 과대 tracking, 이미지 위 저대비 카피, 과도한 center 정렬, max-width 없는 긴 행, 44/48 미만 터치.
2. **골격은 보존, 수치만 한글 규칙으로 치환.** 레이아웃 구조를 갈아엎지 말고 본문 크기·줄간격·자간·간격·컬럼·breakpoint를 foundation 값으로 바꾼다 (최소 영향).
3. 본문·라벨 non-zero tracking → 0. 제목의 비영 자간은 서체 기준과 렌더링 검수 근거가 있을 때만 유지한다. 회색 본문(`text-tertiary`) → `text-primary`/`secondary`.
4. 긴 문단을 BodyBlock으로 감싸 행 길이를 24~34자/45~65자로 제한.
5. 변경 전/후를 항목별로 남긴다 (무엇을 왜 바꿨는지).

### 모드 3 — 검수 (규칙 대비 리뷰)

만들어진 화면을 규칙표 대비 판정한다. 코드를 크게 바꾸지 않고 지적한다.

1. `qa-checklist.md`의 항목을 레이아웃 관점으로 적용: 본문 크기, 줄간격, 자간, 마진/거터 토큰, 색 대비, 확대 대응(200%/대시보드 400%), 터치 목표, 대시보드 구조(horizontal scroll 지양·중요 지표 상단), 행 길이(max-width 유무).
2. 각 항목을 **PASS / FAIL / N/A**로 기록하고, FAIL은 기대값·실제값·수정 제안을 붙인다.
3. 차트/표 내부 규칙 위반이 보이면 판정하지 말고 **korean-dataviz로 넘기라고 표시**한다 (경계 존중).

## 유형별 상세 (필요할 때 로드)

- **`references/web-app.md`** — 관리자/서비스 웹앱. 본문 16~17, 컬럼 small 4–6 / medium 8–12 / large 12–16, CTA·터치, 회색 남용 금지, 폼/리스트 밀도. 예시 포함.
- **`references/landing.md`** — 랜딩/마케팅. 본문 17~18, Hero 44/60, 컬럼 모바일 4 / tablet 8 / desktop 12, 이미지 위 카피·center 남용 주의. 예시 포함.
- **`references/landing-trust-conversion.md`** — 랜딩 신뢰 요소(로고월·도입사례·인증마크)·B2B CTA 선택 로직·리드폼 길이·요금제 표기·섹션 순서 관례. *랜딩/B2B 전환 설계 시 landing.md와 함께 조회.*
- **`references/dashboard.md`** — 대시보드. inverted pyramid, 카드 간격 16~24, horizontal scroll 금지, KPI 28~40, 과적재 금지, 그리드 셸 예시. KPI/차트/표 내부는 korean-dataviz와 경계 협업.

## 실제 예시 — 유틸 네이밍 규약대로

토큰 유틸(`text-headline`, `text-body`, `text-primary`, `bg-surface` 등)을 일관되게 쓴다. 아래 예시는 그대로 동작한다.

### PageHeader (슬롯: eyebrow / title / description / actions)

`assets/PageHeader.tsx`에 전체 구현이 있다. 핵심:

```tsx
// title = headline(32px) + 0em tracking, description = body + secondary
<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
  <div className="flex flex-col gap-8">
    {eyebrow && <p className="text-label text-secondary">{eyebrow}</p>}
    <h1 className="text-headline text-primary">{title}</h1>
    {description && (
      <p className="text-body text-secondary max-w-[40rem]">{description}</p>
    )}
  </div>
  {actions && <div className="flex shrink-0 items-center gap-8">{actions}</div>}
</header>
```

### BodyBlock (슬롯: heading? / body, max-width 필수)

`assets/BodyBlock.tsx` 참조. 한글 24~34자(default 32rem) / 혼합 45~65자(40rem)로 행 길이를 묶는다.

```tsx
<section className="max-w-[32rem]">
  {heading && <h2 className="mb-16 text-title text-primary">{heading}</h2>}
  <div className="text-body text-primary">{children}</div>
</section>
```

### 페이지 셸 (헤더 + max-width 컨테이너 + 본문 그리드)

```tsx
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-primary">
      {/* 상단 바: 터치 44px 이상, 대비 확보 */}
      <header className="sticky top-0 z-10 border-b border-surface-muted bg-surface">
        <div className="mx-auto flex h-[56px] max-w-[1280px] items-center justify-between px-16 md:px-24">
          <span className="text-title">서비스명</span>
          <nav className="flex items-center gap-16 text-label text-secondary">
            <a className="min-h-[44px] inline-flex items-center" href="#">대시보드</a>
            <a className="min-h-[44px] inline-flex items-center" href="#">설정</a>
          </nav>
        </div>
      </header>

      {/* 본문 컨테이너: 화면이 넓어도 컬럼/여백 유지 */}
      <main className="mx-auto max-w-[1280px] px-16 py-32 md:px-24 md:py-48">
        {/* 12컬럼 그리드, 거터 24px */}
        <div className="grid grid-cols-4 gap-24 md:grid-cols-8 lg:grid-cols-12">
          {children}
        </div>
      </main>
    </div>
  );
}
```

컬럼 수(4→8→12)와 거터(24), 컨테이너 max-width(1280), 섹션 패딩(py-32→py-48)이 모두 토큰 스케일 안에서 breakpoint에 따라 커진다.

## 반환 스키마 (사람 메시지가 아니라 데이터)

이 스킬이 호출되면 문장이 아니라 아래 구조의 데이터를 반환한다.

**생성/변환 모드:**
```json
{
  "mode": "generate | transform",
  "type": "web-app | landing | dashboard",
  "files": [{ "path": "<절대경로>", "purpose": "<역할>" }],
  "tokensUsed": ["text-body", "text-headline", "bg-surface", "..."],
  "changes": [{ "target": "<무엇>", "from": "<이전>", "to": "<이후>", "why": "<근거>" }],
  "deferred": [{ "to": "korean-dataviz | korean-design-tokens", "reason": "<경계 사유>" }],
  "notes": "<가정·예외>"
}
```
(생성 모드는 `changes` 생략 가능, 변환 모드에서 필수.)

**검수 모드:**
```json
{
  "mode": "review",
  "type": "web-app | landing | dashboard",
  "findings": [
    { "item": "본문 크기", "status": "PASS | FAIL | N/A",
      "expected": "16~17px", "actual": "14px", "fix": "text-body로 교체" }
  ],
  "deferred": [{ "to": "korean-dataviz", "reason": "차트 시리즈 수는 dataviz 소관" }],
  "summary": { "pass": 0, "fail": 0, "na": 0 }
}
```
