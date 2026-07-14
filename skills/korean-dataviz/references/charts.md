# 차트 상세 — 한글 규칙 + Recharts 코드

> 근거: `korean-design-foundation`의 `design-type-matrix.md`(2절 차트 예외), `color-contrast.md`(차트 색), `component-slots.md`(ChartCard 6슬롯), `tokens.dtcg.json`(색·타입 토큰). 값이 애매하면 원본을 조회한다. 지어내지 않는다.

## 목차
1. 차트 유형 선택 규칙
2. 시리즈·색·라벨 규칙 (why)
3. ChartCard 6슬롯 구현
4. 막대(Bar) 예시
5. 선(Line) 예시 — 다중 시계열
6. 도넛(Donut) 예시
7. 축·격자·툴팁 공통 스타일
8. 접근성: alt · source · download
9. 반응형 배치
10. 흔한 실패 → 교정

---

## 1. 차트 유형 선택 규칙

| 데이터 성격 | 유형 | 이유 | 피할 것 |
|---|---|---|---|
| 범주 간 크기 비교 | 막대(Bar) | 길이 비교가 가장 정확 | 3D·과한 그라디언트 |
| 시간에 따른 추세(단·다계열) | 선(Line) | 추세·교차·기울기가 드러남 | 시계열을 막대로 |
| 부분/전체 (범주 ≤ 5) | 도넛(Donut) | 소수 구성 비율에 적합 | 6개↑ 조각, 라벨 겹침 |
| 누적 구성 (스택 ≤ 4) | Stacked Bar | 구성+합계 동시 표현 | 스택 5범주↑ |

**원칙:** 정확한 비교가 필요하면 길이(막대), 추세면 선. 비율은 조각이 적을 때만 도넛, 아니면 막대로 바꾼다.

## 2. 시리즈·색·라벨 규칙 (why)

- **시리즈 ≤ 4.** 색으로 계열을 추적하는 인지 부담은 4개를 넘으면 급증한다. 초과 시 하위 항목을 "기타"로 합산하거나, 계열별 스몰멀티플(작은 차트 여러 개)로 나눈다.
- **stacked ≤ 4범주 / clustered ≤ 4막대.** 스택/클러스터가 두꺼우면 개별 세그먼트 비교가 불가능해진다. 5개 이상이면 100% 스택으로 바꾸거나 유형을 재검토.
- **gridline ≤ 10.** 격자는 값 읽기를 돕는 보조선이지 주인공이 아니다. 수평선만 남기고(`vertical={false}`) 색은 `#E5E7EB` 수준 저대비로.
- **범례보다 직접 라벨링.** 범례가 있으면 색↔이름을 시선이 왕복한다. 선 끝(`LabelList`)·막대 끝에 이름/값을 직접 붙이면 한글에서 훨씬 빨리 읽힌다. 범례가 불가피하면 하단 가로 배치.
- **색 < 5, 인접 대비 3:1.** categorical 4색(`chart.categorical.1~4`)까지. 한 계열만 강조할 땐 `chart.focus` 1개 + 나머지 `chart.muted`(#9CA3AF). 색만으로 구분하지 않는다 — 패턴/직접 라벨/굵기 병행(색각 고려).
- **숫자 타이포:** 축·데이터 라벨은 `tabular-nums`, 자간 0, 크기 14px(모바일 13px). 큰 강조 수치만 `text-headline`/`text-display`.

### 색 토큰 (tokens.dtcg.json)

```ts
export const CHART_COLORS = {
  categorical: ["#2563EB", "#059669", "#D97706", "#7C3AED"], // chart.categorical.1~4
  focus: "#2563EB",  // chart.focus
  muted: "#9CA3AF",  // chart.muted
  grid: "#E5E7EB",
  axis: "#4B5563",   // text.secondary
  label: "#111111",  // text.primary
} as const;
```

Recharts는 `fill`/`stroke`에 문자열 색을 요구하므로 Tailwind 클래스가 아니라 이 상수를 참조한다. 상수 값은 foundation 토큰의 미러다.

## 3. ChartCard 6슬롯 구현

`ChartCard`는 **title / subtitle / chart / description / source / download** 6슬롯을 가진다. description·source·download는 접근성·공공 분석 가이드 요구라 **생략 불가**. 바로 쓰는 완성본은 [`../assets/ChartCard.tsx`](../assets/ChartCard.tsx).

슬롯 매핑:
- `title` → `text-title`, `text-primary`
- `subtitle` → `text-label`, `text-secondary`
- `chart` → 차트 영역, `role="img"` + `aria-label={description}`
- `description` → `text-body-dense`, `text-secondary` (=alt와 동일 문구)
- `source` → `text-caption`, `text-tertiary` (출처는 캡션 예외적으로 tertiary 허용)
- `download` → 데이터 CSV 다운로드 버튼, `text-label`

## 4. 막대(Bar) 예시

범주 비교. 직접 라벨링 + 수평 격자 + tabular 축.

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "./chartColors";

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
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: CHART_COLORS.grid }}
          tick={{ fontSize: 14, fill: CHART_COLORS.axis }} />
        <YAxis tickLine={false} axisLine={false} width={48}
          tick={{ fontSize: 14, fill: CHART_COLORS.axis }}
          tickFormatter={(v: number) => v.toLocaleString("ko-KR")} />
        <Bar dataKey="value" fill={CHART_COLORS.focus} radius={[8, 8, 0, 0]} maxBarSize={48}>
          <LabelList dataKey="value" position="top"
            formatter={(v: number) => v.toLocaleString("ko-KR")}
            style={{ fontSize: 14, fill: CHART_COLORS.label, fontVariantNumeric: "tabular-nums" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

**클러스터 막대**가 필요하면 `<Bar>`를 최대 4개까지, 각각 `CHART_COLORS.categorical[i]`. 클러스터당 4막대 초과 금지.

## 5. 선(Line) 예시 — 다중 시계열

시간축 다계열은 **선**으로. 범례 대신 각 선 끝에 계열명 라벨.

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "./chartColors";

const data = [
  { month: "1월", 매출: 320, 비용: 210 },
  { month: "2월", 매출: 410, 비용: 250 },
  { month: "3월", 매출: 380, 비용: 240 },
  { month: "4월", 매출: 520, 비용: 300 },
];

const series = [
  { key: "매출", color: CHART_COLORS.focus },
  { key: "비용", color: CHART_COLORS.muted },
];

export function RevenueLine() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 24, right: 56, bottom: 8, left: 8 }}>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: CHART_COLORS.grid }}
          tick={{ fontSize: 14, fill: CHART_COLORS.axis }} />
        <YAxis tickLine={false} axisLine={false} width={48}
          tick={{ fontSize: 14, fill: CHART_COLORS.axis }}
          tickFormatter={(v: number) => v.toLocaleString("ko-KR")} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color}
            strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false}>
            {/* 마지막 점에만 계열명 직접 라벨링 */}
            <LabelList dataKey={s.key} position="right"
              content={({ x, y, index }) =>
                index === data.length - 1 ? (
                  <text x={Number(x) + 8} y={Number(y)} dy={4}
                    fontSize={14} fill={s.color}>{s.key}</text>
                ) : null
              } />
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

계열이 4개를 넘으면 스몰멀티플로 나눈다. 다중 시계열을 stacked bar로 그리지 않는다.

## 6. 도넛(Donut) 예시

부분/전체, 조각 ≤ 5. 조각 안/옆에 라벨 직접 표기.

```tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "./chartColors";

const data = [
  { name: "모바일", value: 62 },
  { name: "데스크톱", value: 28 },
  { name: "태블릿", value: 10 },
];

export function ChannelDonut() {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name"
          innerRadius="58%" outerRadius="80%" paddingAngle={2}
          isAnimationActive={false}
          label={({ name, value }) => `${name} ${Math.round((value / total) * 100)}%`}
          labelLine={false}
          style={{ fontSize: 14, fill: CHART_COLORS.label }}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS.categorical[i % CHART_COLORS.categorical.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
```

조각이 6개 이상이면 도넛을 버리고 막대로 바꾼다(작은 조각은 라벨이 겹쳐 못 읽는다).

## 7. 축·격자·툴팁 공통 스타일

- **격자:** `vertical={false}`, `stroke="#E5E7EB"`. 수평선 위주, 10개 이하.
- **축선:** X축만 옅은 선, Y축은 `axisLine={false}` 권장(값은 라벨로 읽음).
- **틱:** `tickLine={false}`, `fontSize:14`(모바일 13), `fill: text.secondary(#4B5563)`.
- **숫자 포맷:** `toLocaleString("ko-KR")`로 천단위 콤마, `tabular-nums`로 폭 고정.
- **툴팁:** 커스텀 시 `bg-surface` + 옅은 border + `text-body-dense`. 색 스와치 + 이름 + `tabular-nums` 값.

## 8. 접근성: alt · source · download

세 가지는 차트마다 **반드시** 제공한다.

- **alt(대체 설명):** 차트 영역에 `role="img"` + `aria-label`. 문구는 화면의 `description` 슬롯과 동일하게(핵심 인사이트 한 문장 + 범위/단위).
- **source(출처):** 데이터 출처·기준일을 캡션으로. 예: "출처: 사내 데이터, 2026-06 기준".
- **download(데이터 다운로드):** 원본 데이터를 CSV로 내려받는 버튼. 시각 정보를 못 보는 사용자·재분석 필요자를 위한 필수 대안. 구현은 [`../assets/ChartCard.tsx`](../assets/ChartCard.tsx)의 `toCsv` 참고(BOM 포함, 한글 엑셀 호환).

## 9. 반응형 배치

- 열: **모바일 1열 → 태블릿(md 768) 2열 → 데스크톱(lg 1024+) 3~4열.**
- 카드 패딩: 데스크톱 `p-24`, 모바일 `p-16`.
- 차트 높이: 모바일에서 과하게 키우지 말고 260~320px. `ResponsiveContainer width="100%"`로 폭 대응.
- 축 라벨이 겹치면 각도 회전 대신 라벨 축약·틱 간격 확대·유형 재검토.

## 10. 흔한 실패 → 교정

| 실패 | 교정 |
|---|---|
| 시리즈 5개+ | "기타" 합산 또는 스몰멀티플로 4 이하 |
| 범례 남발 | 직접 라벨링(선 끝/막대 끝)으로 전환 |
| 다중 시계열을 막대로 | 선 차트로 변경 |
| gridline 과다·세로격자 | 수평선만, 10개 이하, 저대비 |
| 색 5개+ / 저대비 | categorical 4색, focus+muted, 인접 3:1 |
| 숫자 좌정렬·가변폭 | 우정렬 + `tabular-nums` |
| alt/source/download 누락 | ChartCard 6슬롯 강제 |
| 라벨 12~13px 미만 회색 | 14px, 축 text.secondary·값 text.primary |
