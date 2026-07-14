---
name: korean-dataviz
description: 차트·표·데이터 시각화를 한글 규칙으로 만들거나(생성)·외국/기존 시각화를 한글로 옮기거나(변환)·규칙 대비 리뷰(검수)할 때 사용. Recharts + Tailwind 기반. 시리즈 수 제한·직접 라벨링·정렬·ChartCard 6슬롯·TableWrapper를 강제한다. 막대/선/도넛 차트, 데이터 테이블, KPI 수치 표시, "차트가 촌스러워/범례가 복잡해/표 숫자가 안 맞아 보여"류 요청에 반응한다. 단, 페이지 골격·헤더·그리드·CTA 등 일반 레이아웃은 korean-web-layout으로, 토큰 정의·수치 근거 조회는 korean-design-foundation으로 넘길 것. 차트의 시각 규칙만 다루며, 데이터 계산·집계 수식 오류나 데이터 로직 버그 수정은 이 스킬의 범위가 아니다(일반 코딩으로 처리).
---

# Korean Dataviz — 한글 차트·표 구현

차트와 표를 **한국어 규칙**으로 구현한다. 스택은 **React + Recharts + Tailwind CSS**. 이 스킬은 `korean-dataviz-designer` 에이전트가 사용한다.

## 근거 (SSOT)

모든 수치·토큰·규칙은 지어내지 않고 **korean-design-foundation**을 근거로 삼는다. 값이 애매하면 아래를 조회한다.

- 규칙 요약·원칙: [`../korean-design-foundation/SKILL.md`](../korean-design-foundation/SKILL.md)
- 차트/표 예외 규칙: [`../korean-design-foundation/references/design-type-matrix.md`](../korean-design-foundation/references/design-type-matrix.md) (2~3절)
- 색·대비·차트 팔레트: [`../korean-design-foundation/references/color-contrast.md`](../korean-design-foundation/references/color-contrast.md)
- 컴포넌트 슬롯: [`../korean-design-foundation/references/component-slots.md`](../korean-design-foundation/references/component-slots.md)
- 토큰 원본: [`../korean-design-foundation/references/tokens.dtcg.json`](../korean-design-foundation/references/tokens.dtcg.json)
- 검수: [`../korean-design-foundation/references/qa-checklist.md`](../korean-design-foundation/references/qa-checklist.md)

이 스킬 내부 상세:
- 차트 상세 + Recharts 코드: [`references/charts.md`](references/charts.md)
- 표 상세 + 반응형 코드: [`references/tables.md`](references/tables.md)
- 바로 쓰는 컴포넌트: [`assets/ChartCard.tsx`](assets/ChartCard.tsx) · [`assets/TableWrapper.tsx`](assets/TableWrapper.tsx)

## Tailwind 유틸 규약

예시·산출 코드는 `korean-design-tokens`가 확장한 유틸 이름만 쓴다. 재발명 금지.

- 타입: `text-caption` `text-label` `text-body` `text-body-dense` `text-title` `text-headline` `text-display` (각각 폰트 크기+줄간격 묶음)
- 자간: 기본 0. `tracking-tight`/`tracking-tighter`는 렌더링 검수 후 짧은 제목에만 선택적으로 사용
- 간격: `p-4 p-8 p-12 p-16 p-24 ...` (숫자 = px 그대로), 색: `text-primary/secondary/tertiary`, `bg-surface` `bg-surface-muted`
- 숫자 정렬: `tabular-nums` (표·KPI·축 라벨 필수)
- 차트 색은 Recharts에 문자열로 넣어야 하므로 토큰 hex를 상수로 참조한다 (`assets/ChartCard.tsx`의 `CHART_COLORS`).

---

## 세 작업 모드

이 스킬은 셋 중 하나로 호출된다. 어느 모드든 마지막에 **데이터(스키마)** 를 반환한다 — 사람용 문장이 아니다.

### 1. 생성 (새로 만듦)
데이터와 목적을 받아 새 차트/표를 만든다.
1. 데이터 형태 파악: 범주형 비교 → 막대, 시계열 → 선, 부분/전체(≤5) → 도넛, 표 형태 → TableWrapper.
2. 시리즈·색·라벨을 아래 "차트 규칙"으로 정리한다.
3. `ChartCard`/`TableWrapper`로 감싸 **6슬롯/정렬 규칙**을 채운다 (description·source·download 생략 불가).
4. 반환 스키마로 파일·토큰·검수 결과를 낸다.

### 2. 변환 (외국/기존 → 한글)
기존 차트·표(영문 템플릿, 과밀 대시보드 등)를 한글 규칙으로 옮긴다.
1. 진단: 시리즈 5+? 범례 남발? 숫자 좌정렬? vertical line? 저대비 회색? 다중 시계열을 막대로?
2. 축소: 시리즈를 4 이하로 묶고(기타 합산), 범례를 직접 라벨링으로, 색을 4색 이하로.
3. 토큰 치환: raw px/hex → 유틸/토큰. 본문 크기·자간·줄간격을 한글 기준으로 보정.
4. 변경 전/후 diff와 검수 결과를 반환한다.

### 3. 검수 (규칙 대비 리뷰)
완성물을 규칙과 대조해 PASS/FAIL/N/A로 판정한다. 코드를 고치지 않고 findings만 낸다.
1. `qa-checklist.md`의 차트·표 항목 + 아래 규칙으로 훑는다.
2. 각 위반을 근거 수치와 수정 제안과 함께 기록한다.
3. 검수 스키마(아래)로 반환한다.

---

## 차트 규칙 (why 포함)

한글은 라벨 밀도가 빨리 높아진다. 요소가 많을수록 라틴보다 빨리 어수선해지므로 **덜어내는 쪽**으로 규칙이 서 있다.

- **시리즈 ≤ 4.** 5개 이상은 눈이 색을 추적 못 한다. 초과분은 "기타"로 합산하거나 스몰멀티플로 분리.
- **stacked bar: 스택당 4범주 이내. clustered bar: 클러스터당 막대 4개 이내.** 스택/클러스터가 두꺼워지면 개별 값 비교가 무너진다.
- **gridline ≤ 10.** 격자가 촘촘하면 데이터가 아니라 선이 먼저 보인다. `CartesianGrid`는 수평선만, 저대비로.
- **범례보다 직접 라벨링.** 범례는 시선을 색↔이름으로 왕복시킨다. 선 끝·막대 끝에 값/이름을 직접 붙이면 한글에서 특히 읽기 쉽다.
- **다중 시계열 = 선 차트.** 시간축의 여러 계열을 막대로 그리지 않는다 (추세가 안 보이고 막대만 빽빽).
- **색 < 5 + 인접 대비 3:1.** categorical 4색까지, 강조는 `chart.focus` 1개 + 나머지 `chart.muted`. 색만으로 구분하지 않는다(색각 고려).
- **alt · source · download 필수.** 차트 영역에 `role="img"` + `aria-label`(=description), 출처 캡션, 데이터 다운로드(CSV)를 모두 제공한다. 공공 분석·접근성 요구사항이라 생략 불가.
- **축·라벨 타이포:** 축/데이터 라벨 `text-label`(14px, 모바일 13px), 자간 0, 숫자는 `tabular-nums`. 카드 제목 `text-title`, 강조 수치는 `text-headline`~`text-display`.
- **카드 패딩·반응형:** 데스크톱 `p-24`, 모바일 `p-16`. 열 배치는 모바일 1열 → 태블릿 2열 → 데스크톱 3~4열.

### 차트 유형 선택

| 데이터 | 유형 | 근거 |
|---|---|---|
| 범주 간 크기 비교 | 막대(Bar) | 길이 비교가 가장 정확 |
| 시간에 따른 추세(다계열) | 선(Line) | 추세·교차가 드러남 |
| 부분/전체 (범주 ≤5) | 도넛(Donut) | 6개↑면 막대로 대체 |
| 누적 구성 (스택 ≤4) | Stacked Bar | 스택 두꺼우면 100% 기준 또는 분리 |

## 표 규칙 (why 포함)

- **숫자 우정렬 · 텍스트 좌정렬.** 자릿수를 맞춰 위아래로 스캔되게 한다. 숫자는 `tabular-nums`로 폭 고정.
- **셀 텍스트 3줄 이내.** 넘치면 요약 + 상세 링크. 표는 스캔용이지 문단이 아니다.
- **vertical line 지양.** 세로선은 시선을 끊는다. 구분은 가로 행 경계(옅은 border) 위주.
- **셀 패딩 12×16px(`py-12 px-16`) · 행 높이 44~48px.** 터치·스캔 여유. 헤더는 sticky.
- **반응형:** 좁으면 **카드형 전환**(행 = 카드) 또는 **가로 스크롤 + 헤더 고정**. 큰 표는 **pagination**. 모달 안에 큰 표 금지.
- 색·배경은 `bg-surface`/`bg-surface-muted`, 텍스트는 `text-primary`(본문)·`text-secondary`(보조). `text-tertiary`는 본문에 쓰지 않는다(대비 미달).

---

## 최소 Recharts 예시 (막대)

직접 라벨링·색 토큰·수평 gridline·tabular 축을 갖춘 뼈대. 전체 3종(막대/선/도넛)과 6슬롯 카드는 [`references/charts.md`](references/charts.md), 바로 쓰는 컴포넌트는 [`assets/ChartCard.tsx`](assets/ChartCard.tsx).

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer } from "recharts";

// 토큰 hex (foundation tokens.dtcg.json 미러). Recharts는 색을 문자열로 받는다.
const CHART = { focus: "#2563EB", muted: "#9CA3AF" };

const data = [
  { name: "1분기", value: 1240 },
  { name: "2분기", value: 1580 },
  { name: "3분기", value: 1410 },
  { name: "4분기", value: 1920 },
];

export function QuarterlyBar() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 8 }}>
        {/* 수평 gridline만, 저대비 */}
        <CartesianGrid vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#E5E7EB" }}
          tick={{ fontSize: 14, fill: "#4B5563" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fontSize: 14, fill: "#4B5563" }}
          className="tabular-nums"
        />
        <Bar dataKey="value" fill={CHART.focus} radius={[8, 8, 0, 0]} maxBarSize={48}>
          {/* 범례 대신 막대 끝 직접 라벨링 */}
          <LabelList
            dataKey="value"
            position="top"
            className="tabular-nums"
            formatter={(v: number) => v.toLocaleString("ko-KR")}
            style={{ fontSize: 14, fill: "#111111" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

이 차트는 반드시 `ChartCard`로 감싸 title/subtitle/**description(=alt)**/source/download를 채운다.

---

## 반환 스키마

호출한 에이전트가 파싱할 수 있게 **데이터**로 반환한다. 모드별로 형태가 다르다.

### 생성/변환 모드
```json
{
  "mode": "generate | convert",
  "artifacts": [
    { "path": "src/charts/QuarterlyBar.tsx", "kind": "chart | table", "chartType": "bar | line | donut | table" }
  ],
  "tokensUsed": ["text-title", "text-label", "chart.focus", "space.24", "tabular-nums"],
  "checks": [
    { "rule": "series<=4", "status": "PASS | FAIL | N/A", "note": "" }
  ],
  "diff": "convert 모드에서 전/후 요약 (generate면 null)"
}
```

### 검수 모드
```json
{
  "mode": "review",
  "target": "리뷰 대상 경로/설명",
  "findings": [
    {
      "rule": "series-count | direct-labeling | number-alignment | chart-slots | alt-source-download | vertical-line | gridline | multiseries-line | color-contrast | ...",
      "status": "PASS | FAIL | N/A",
      "evidence": "근거 수치/코드 위치",
      "fix": "구체 수정 제안"
    }
  ],
  "summary": { "pass": 0, "fail": 0, "na": 0 }
}
```

FAIL은 반드시 근거 수치와 수정 제안을 함께 담는다. 상충 데이터는 삭제하지 말고 출처를 병기한다.
