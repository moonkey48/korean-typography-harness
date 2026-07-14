/**
 * TableWrapper — 한글 규칙 데이터 표 (React + Tailwind)
 *
 * 슬롯: title / description? / source? / download? / table
 * 강제 규칙:
 *   - 숫자 우정렬 + tabular-nums, 텍스트 좌정렬
 *   - sticky header (헤더 클릭 정렬)
 *   - vertical line 지양 (가로 행 경계만)
 *   - 셀 패딩 12×16(py-12 px-16), 행 높이 44~48px
 *   - 좁은 화면 카드 전환(useIsNarrow)
 *   - 큰 표 pagination
 *
 * 근거: korean-design-foundation
 *   - references/design-type-matrix.md (3절 표 규칙)
 *   - references/spacing-grid.md (셀 패딩·행 높이·반응형)
 *   - references/component-slots.md (TableWrapper)
 *
 * Tailwind 유틸: text-title/label/body-dense/caption, text-primary/secondary/tertiary,
 *   bg-surface/bg-surface-muted, py-12 px-16 등 (korean-design-tokens 확장). tabular-nums 기본.
 *
 * 의존성: react 만. 그대로 임포트해 사용 가능.
 */
import * as React from "react";

export interface Column<T> {
  key: keyof T & string;
  header: string;
  /** number 면 우정렬 + tabular-nums, 그 외 좌정렬 */
  type?: "number" | "text";
  /** 명시 정렬(자동 추론보다 우선) */
  align?: "left" | "right";
  /** 셀 표시 변환(예: 통화·비율 포맷) */
  format?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface TableWrapperProps<T extends Record<string, unknown>> {
  title: string;
  description?: string;
  source?: string;
  /** 있으면 CSV 다운로드 버튼 노출 */
  download?: { name?: string };
  columns: Array<Column<T>>;
  rows: T[];
  /** 페이지당 행 수(주면 pagination 활성) */
  pageSize?: number;
  /** 이 폭(px) 미만이면 카드형으로 전환 (기본 768=md) */
  cardBreakpoint?: number;
  className?: string;
}

/** 뷰포트가 breakpoint 미만인지 (SSR 안전) */
export function useIsNarrow(breakpoint = 768): boolean {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return narrow;
}

const isRight = <T,>(c: Column<T>) =>
  (c.align ?? (c.type === "number" ? "right" : "left")) === "right";

const koNum = (v: unknown) =>
  typeof v === "number" ? v.toLocaleString("ko-KR") : String(v ?? "");

function useSort<T extends Record<string, unknown>>(rows: T[]) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(
    null
  );
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const { key, dir } = sort;
    return [...rows].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""), "ko-KR");
      return dir === "asc" ? cmp : -cmp;
    });
  }, [rows, sort]);
  const toggle = (key: string) =>
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  return { sorted, sort, toggle };
}

function toCsv<T extends Record<string, unknown>>(rows: T[], columns: Array<Column<T>>): string {
  const esc = (val: unknown) => {
    const s = val == null ? "" : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    columns.map((c) => esc(c.header)).join(","),
    ...rows.map((r) => columns.map((c) => esc(r[c.key])).join(",")),
  ];
  return "﻿" + lines.join("\n"); // BOM: 한글 Excel 호환
}

function downloadCsv(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name.endsWith(".csv") ? name : `${name}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function TableWrapper<T extends Record<string, unknown>>({
  title,
  description,
  source,
  download,
  columns,
  rows,
  pageSize,
  cardBreakpoint = 768,
  className = "",
}: TableWrapperProps<T>) {
  const narrow = useIsNarrow(cardBreakpoint);
  const { sorted, sort, toggle } = useSort(rows);

  const [page, setPage] = React.useState(0);
  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  React.useEffect(() => {
    if (page > pages - 1) setPage(0);
  }, [page, pages]);
  const view = pageSize ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;

  const cell = (row: T, c: Column<T>): React.ReactNode =>
    c.format ? c.format(row[c.key], row) : c.type === "number" ? koNum(row[c.key]) : String(row[c.key] ?? "");

  return (
    <section className={`flex flex-col gap-16 rounded-lg bg-surface p-24 shadow-sm ${className}`}>
      {/* 슬롯: title / description */}
      <div className="flex flex-col gap-4">
        <h3 className="text-title text-primary">{title}</h3>
        {description ? <p className="text-body-dense text-secondary">{description}</p> : null}
      </div>

      {/* 슬롯: table (넓으면 표, 좁으면 카드) */}
      {narrow ? (
        <ul className="grid gap-12">
          {view.map((row, i) => (
            <li key={i} className="rounded-md bg-surface-muted p-16">
              {columns.map((c) => (
                <div key={c.key} className="flex justify-between gap-16 py-4">
                  <span className="text-label text-secondary">{c.header}</span>
                  <span
                    className={`text-body-dense text-primary ${
                      isRight(c) ? "text-right tabular-nums" : "text-left"
                    }`}
                  >
                    {cell(row, c)}
                  </span>
                </div>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full border-collapse">
            {/* vertical line 없음: 가로 행 경계만 */}
            <thead className="sticky top-0 z-10 bg-surface-muted">
              <tr>
                {columns.map((c) => {
                  const right = isRight(c);
                  const active = sort?.key === c.key;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}
                      onClick={() => toggle(c.key)}
                      className={`cursor-pointer select-none border-b border-[#E5E7EB] py-12 px-16 text-label text-secondary ${
                        right ? "text-right" : "text-left"
                      }`}
                    >
                      {c.header}
                      {active ? (sort!.dir === "asc" ? " ▲" : " ▼") : ""}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {view.map((row, i) => (
                <tr key={i} className="border-b border-[#F0F1F3]">
                  {columns.map((c) => {
                    const right = isRight(c);
                    return (
                      <td
                        key={c.key}
                        className={`h-[44px] py-12 px-16 text-body-dense text-primary ${
                          right ? "text-right tabular-nums" : "text-left"
                        }`}
                      >
                        {cell(row, c)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination (pageSize 지정 시) */}
      {pageSize && pages > 1 ? (
        <div className="flex items-center justify-end gap-16 text-label text-secondary">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="min-h-[44px] px-16 disabled:opacity-40"
          >
            이전
          </button>
          <span className="tabular-nums">
            {page + 1} / {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page >= pages - 1}
            className="min-h-[44px] px-16 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      ) : null}

      {/* 슬롯: source / download */}
      {(source || download) && (
        <div className="flex items-center justify-between gap-16 border-t border-[#E5E7EB] pt-12">
          <span className="text-caption text-tertiary">{source ?? ""}</span>
          {download ? (
            <button
              type="button"
              onClick={() => downloadCsv(download.name ?? "table-data", toCsv(sorted, columns))}
              className="text-label text-primary underline underline-offset-2 hover:opacity-80"
            >
              데이터 다운로드(CSV)
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default TableWrapper;
