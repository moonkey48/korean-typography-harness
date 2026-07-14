# 표(Table) 상세 — 한글 규칙 + 반응형 코드

> 근거: `korean-design-foundation`의 `design-type-matrix.md`(3절 표 규칙), `spacing-grid.md`(셀 패딩·행 높이·반응형), `component-slots.md`(TableWrapper), `color-contrast.md`(대비). 값이 애매하면 원본을 조회한다.

## 목차
1. 정렬 규칙 (숫자/텍스트)
2. 셀·행·구분선 규칙 (why)
3. TableWrapper 슬롯 구현
4. 정렬(sort)·sticky header 구현
5. 반응형: 카드 전환 훅
6. 반응형: 가로 스크롤 + 헤더 고정
7. pagination
8. 흔한 실패 → 교정

---

## 1. 정렬 규칙 (숫자/텍스트)

- **숫자·통화·비율·날짜(정량) → 오른쪽 정렬.** 자릿수를 맞춰 위아래로 스캔되게 한다. 반드시 `tabular-nums`(고정폭 숫자)로 폭을 고정해 숫자가 흔들리지 않게 한다.
- **텍스트·이름·범주(정성) → 왼쪽 정렬.** 한글은 왼쪽에서 읽으므로 좌정렬이 스캔 라인을 만든다.
- **헤더 정렬은 셀 정렬과 일치**시킨다(숫자 열 헤더도 우정렬).
- 열 정의에서 `type: "number"`면 자동으로 우정렬 + `tabular-nums`, 아니면 좌정렬. 명시 `align`이 있으면 우선.

## 2. 셀·행·구분선 규칙 (why)

- **셀 텍스트 3줄 이내.** 표는 스캔용이다. 넘치면 요약 + 상세(툴팁/링크/펼치기). 셀 안에 문단을 넣지 않는다.
- **vertical line(세로 구분선) 지양.** 세로선은 시선을 끊고 밀도를 높인다. 구분은 **가로 행 경계**(옅은 하단 border, `#E5E7EB` 수준)로.
- **셀 패딩 12×16px** (`py-12 px-16`), **행 높이 44~48px.** 터치·스캔 여유. 헤더는 약간 더 강조(`text-label`, `text-secondary`, `bg-surface-muted`).
- **얼룩(zebra)은 선택.** 쓰더라도 `bg-surface-muted`로 아주 옅게. 세로선과 얼룩을 동시에 쓰지 않는다.
- **텍스트 색:** 본문 `text-primary`, 보조 열 `text-secondary`. `text-tertiary`(#6B7280)는 본문에 쓰지 않는다(대비 미달). 출처 캡션에만 예외 허용.
- **숫자 포맷:** `toLocaleString("ko-KR")` 천단위 콤마, 단위는 헤더에 표기("매출(만원)")해 셀을 가볍게.

## 3. TableWrapper 슬롯 구현

`TableWrapper` 슬롯: **title / description? / source? / download? / table**. title은 필수, 나머지 메타는 있으면 채운다. 정렬·sticky·카드전환은 표 본체가 강제한다. 완성본은 [`../assets/TableWrapper.tsx`](../assets/TableWrapper.tsx).

슬롯 매핑:
- `title` → `text-title`, `text-primary`
- `description` → `text-body-dense`, `text-secondary`
- `source` → `text-caption`, `text-tertiary`
- `download` → CSV 다운로드 버튼, `text-label`
- `table` → 아래 본체(정렬 규칙·sticky header·반응형 강제)

## 4. 정렬(sort)·sticky header 구현

헤더 클릭으로 오름/내림 토글. 헤더는 `position: sticky; top: 0`로 스크롤 중 고정.

```tsx
type Col = { key: string; header: string; type?: "number" | "text"; align?: "left" | "right" };

function useSort<T extends Record<string, unknown>>(rows: T[]) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const { key, dir } = sort;
    return [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), "ko-KR");
      return dir === "asc" ? cmp : -cmp;
    });
  }, [rows, sort]);
  const toggle = (key: string) =>
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  return { sorted, sort, toggle };
}
```

sticky header 마크업:

```tsx
<thead className="sticky top-0 z-10 bg-surface-muted">
  <tr>
    {cols.map((c) => {
      const alignRight = (c.align ?? (c.type === "number" ? "right" : "left")) === "right";
      return (
        <th key={c.key}
          onClick={() => toggle(c.key)}
          aria-sort={sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
          className={`py-12 px-16 text-label text-secondary cursor-pointer select-none ${alignRight ? "text-right" : "text-left"}`}>
          {c.header}{sort?.key === c.key ? (sort.dir === "asc" ? " ▲" : " ▼") : ""}
        </th>
      );
    })}
  </tr>
</thead>
```

## 5. 반응형: 카드 전환 훅

좁은 화면(모바일)에서는 표를 **행 = 카드**로 전환한다. 각 카드 안에서 `헤더: 값` 쌍을 세로로 쌓는다. md(768px) 미만에서 카드, 이상에서 표.

```tsx
export function useIsNarrow(breakpoint = 768) {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return narrow;
}
```

카드 렌더:

```tsx
{narrow ? (
  <ul className="grid gap-12">
    {sorted.map((row, i) => (
      <li key={i} className="rounded-md bg-surface p-16 shadow-sm">
        {cols.map((c) => {
          const num = c.type === "number";
          return (
            <div key={c.key} className="flex justify-between gap-16 py-4">
              <span className="text-label text-secondary">{c.header}</span>
              <span className={`text-body-dense text-primary ${num ? "text-right tabular-nums" : ""}`}>
                {format(row[c.key], num)}
              </span>
            </div>
          );
        })}
      </li>
    ))}
  </ul>
) : (
  /* 넓은 화면: 위 sticky 표 */
)}
```

## 6. 반응형: 가로 스크롤 + 헤더 고정

카드 전환이 부적절한 밀도 높은 표(열이 아주 많음)는 **가로 스크롤**을 쓰되 헤더와 첫 열을 고정한다.

```tsx
<div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
  <table className="min-w-[720px] w-full border-collapse">
    <thead className="sticky top-0 z-10 bg-surface-muted">{/* ... */}</thead>
    <tbody>{/* 첫 열 고정이 필요하면 first-child에 sticky left-0 */}</tbody>
  </table>
</div>
```

가로 스크롤은 **최후 수단**이다. 가능하면 열을 줄이거나 카드 전환을 먼저 고려한다.

## 7. pagination

행이 많으면(수십 행+) pagination으로 나눈다. 무한 내부 스크롤·모달 안 대형 표는 금지.

```tsx
const PAGE = 10;
const [page, setPage] = React.useState(0);
const paged = sorted.slice(page * PAGE, page * PAGE + PAGE);
const pages = Math.ceil(sorted.length / PAGE);
// 하단에 이전/다음 + "page/pages", 버튼 터치 목표 44px 이상
```

## 8. 흔한 실패 → 교정

| 실패 | 교정 |
|---|---|
| 숫자 좌정렬·가변폭 | 우정렬 + `tabular-nums` |
| 세로 구분선으로 빽빽 | vertical line 제거, 가로 행 경계만 |
| 셀에 문단(4줄+) | 3줄 이내로 요약 + 상세 링크/툴팁 |
| 좁은 화면에서 잘림 | 카드 전환(md 미만) 또는 가로 스크롤+헤더 고정 |
| 수백 행 한 페이지 | pagination |
| 모달 안 대형 표 | 별도 화면/페이지로 분리 |
| 회색(text-tertiary) 본문 | 본문 text-primary, 보조 text-secondary |
| 헤더가 스크롤로 사라짐 | `sticky top-0` 헤더 고정 |
