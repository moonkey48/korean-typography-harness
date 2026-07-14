# 대시보드 레이아웃 규칙 (한글)

> 지표/분석/모니터링 대시보드의 **그리드 셸과 카드 배치**. 근거: `../../korean-design-foundation/references/design-type-matrix.md`(대시보드 행 + 4. 대시보드 구조 규칙), `spacing-grid.md`. 카드 내부(KPI 수치·차트·표)는 이 파일이 아니라 korean-dataviz 소관 — 여기서는 "어디에 몇 열로 놓이는지"까지.

## 이 파일의 경계

- **여기서 정한다:** inverted pyramid 배치, 카드 그리드 컬럼/간격, breakpoint 전환, horizontal scroll 회피, 섹션 밀도.
- **korean-dataviz가 정한다:** KpiCard 4슬롯(eyebrow/metric/delta/help) 내용, ChartCard 6슬롯(title/subtitle/chart/description/source/download), TableWrapper, 차트 시리즈 수·축·색. 셸에서는 그 자리(placeholder 영역)만 잡는다.

## 핵심 수치

| 항목 | 값 | 유틸 | 왜 |
|---|---|---|---|
| 본문 | 데스크톱 14~16px, 모바일 14px | `text-body-dense`(15)/`text-label`(14) | 정보 밀도가 높아 웹앱보다 약간 조밀. 단 12 미만 금지. |
| KPI 수치 | 28~40px | `text-headline`(32)/`text-display`(44는 큰 KPI) | 큰 수치는 한눈에. tabular-nums로 정렬. |
| 카드 제목 | 16~18px | `text-title`(24)까진 크게, 조밀하면 `text-label` | 카드 위계. |
| 줄간격 | 1.45~1.6 | 토큰 | 조밀해도 1.5 근처 유지. |
| 카드 간격 | **16~24px** | `gap-16`/`gap-24` | 카드가 붙으면 위계 붕괴, 너무 벌리면 스크롤 증가. |

## 구조 규칙 (design-type-matrix 4번)

1. **Inverted pyramid.** 가장 중요한 지표(요약 KPI)를 최상단에, 그 아래 추세 차트, 그 아래 상세 표 순서. 사용자가 위→아래로 읽으며 요약→상세로 내려가게 한다.
2. **Horizontal scroll 회피.** 가로 스크롤은 대시보드 최악의 실패. 넓은 표는 카드형 전환 또는 pagination으로 처리하고, 카드 그리드는 좁아지면 열 수를 줄여 세로로 쌓는다.
3. **내부 스크롤 지양.** 카드 안에 또 스크롤 영역을 만들지 않는다. 내용이 많으면 카드를 나눈다.
4. **과적재 금지.** 한 페이지에 차트/표를 몰아넣지 않는다. 한 화면 = 한 목적. 지표가 많으면 탭·페이지로 나눈다.
5. **확대 대응.** 대시보드는 200%뿐 아니라 **400% 확대**도 깨지지 않아야 한다(qa-checklist). 고정 px 폭 남발 금지.

## 그리드 (대시보드)

| 구간 | breakpoint | 컬럼(콘텐츠) | 카드 한 행 |
|---|---|---|---|
| 모바일 | sm 360 | 4 | 세로 1열 |
| 태블릿 | md 768 | 8 | 2열 |
| 데스크톱 | lg 1024 / xl 1280 | 12 | 3~4열 |

- KPI 요약은 데스크톱 4열, 태블릿 2열, 모바일 1열이 기본.
- 차트/표 카드는 폭이 필요하면 `col-span`으로 여러 컬럼을 차지하게 한다.

## 흔한 실패

chart/table 과적재 · 카드 내부 스크롤 · horizontal scroll. 검수 시 이 3가지를 먼저 본다.

## 예시 — 대시보드 그리드 셸 (카드 내부는 dataviz가 채움)

```tsx
export function DashboardShell() {
  return (
    <div className="min-h-screen bg-surface-muted text-primary">
      <main className="mx-auto max-w-[1440px] px-16 py-24 md:px-24">
        <h1 className="text-headline">운영 대시보드</h1>

        {/* 1) 최상단 요약 KPI: 모바일 1 → md 2 → lg 4열 */}
        <section className="mt-24 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          {['오늘 주문', '매출', '취소율', '신규 가입'].map((label) => (
            <div key={label} className="rounded-lg bg-surface p-24">
              {/* KpiCard(eyebrow/metric/delta/help) 자리 — 내용은 korean-dataviz */}
              <p className="text-label text-secondary">{label}</p>
              <p className="mt-8 text-headline tabular-nums">—</p>
            </div>
          ))}
        </section>

        {/* 2) 추세 차트: 넓게. lg에서 12컬럼 중 8 + 4 */}
        <section className="mt-24 grid grid-cols-1 gap-24 lg:grid-cols-12">
          <div className="rounded-lg bg-surface p-24 lg:col-span-8">
            {/* ChartCard 6슬롯 자리 — korean-dataviz가 채움 */}
            <p className="text-title">주간 매출 추이</p>
            <div className="mt-16 h-[240px] rounded-md bg-surface-muted" />
          </div>
          <div className="rounded-lg bg-surface p-24 lg:col-span-4">
            <p className="text-title">채널 비중</p>
            <div className="mt-16 h-[240px] rounded-md bg-surface-muted" />
          </div>
        </section>

        {/* 3) 상세 표: 가로 스크롤 대신 폭 안에서. TableWrapper는 dataviz */}
        <section className="mt-24 rounded-lg bg-surface p-24">
          <p className="text-title">주문 상세</p>
          <div className="mt-16 h-[200px] rounded-md bg-surface-muted" />
        </section>
      </main>
    </div>
  );
}
```

- 배치가 inverted pyramid: KPI(요약) → 차트(추세) → 표(상세).
- 카드 간격 `gap-16`(KPI)~`gap-24`(차트), 모두 토큰 스케일.
- 카드가 좁아지면 열 수만 줄어 세로로 쌓임 — horizontal scroll 없음.
- 각 카드 안의 KPI/차트/표 **내용은 채우지 않고 슬롯만** 잡는다 → korean-dataviz가 6슬롯/4슬롯 규칙대로 채운다.
