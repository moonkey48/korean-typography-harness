/**
 * ChartCard — 한글 규칙 차트 카드 (React + Recharts + Tailwind)
 *
 * 6슬롯(고정): title / subtitle / chart / description / source / download
 *   - description = 화면에 보이는 설명이자 차트 영역의 alt(aria-label)
 *   - source / download 는 접근성·공공 분석 가이드 요구라 생략 불가
 *
 * 근거: korean-design-foundation
 *   - references/component-slots.md (ChartCard 6슬롯)
 *   - references/design-type-matrix.md (차트 예외 규칙)
 *   - references/color-contrast.md, tokens.dtcg.json (차트 색)
 *
 * Tailwind 유틸: text-title/label/body-dense/caption, text-primary/secondary/tertiary,
 *   bg-surface, p-16/p-24 등 (korean-design-tokens 가 theme 확장). tabular-nums 는 기본 제공.
 *
 * 의존성: react, recharts. 그대로 임포트해 사용 가능(플레이스홀더 없음).
 */
import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";

/* 차트 색 토큰 (tokens.dtcg.json 미러). Recharts 는 색을 문자열로 받는다. */
export const CHART_COLORS = {
  categorical: ["#2563EB", "#059669", "#D97706", "#7C3AED"], // chart.categorical.1~4
  focus: "#2563EB", // chart.focus
  muted: "#9CA3AF", // chart.muted
  grid: "#E5E7EB",
  axis: "#4B5563", // text.secondary
  label: "#111111", // text.primary
} as const;

/** 한글 천단위 콤마 포맷 */
export const koNum = (v: number): string => v.toLocaleString("ko-KR");

/**
 * 데이터 배열 → CSV 문자열 (BOM 포함, 한글 Excel 호환).
 * columns 를 주면 헤더/순서를 그 라벨로 맞춘다.
 */
export function toCsv(
  rows: Array<Record<string, unknown>>,
  columns?: Array<{ key: string; header: string }>
): string {
  if (rows.length === 0) return "﻿";
  const keys = columns ? columns.map((c) => c.key) : Object.keys(rows[0]);
  const headers = columns ? columns.map((c) => c.header) : keys;
  const esc = (val: unknown) => {
    const s = val == null ? "" : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    headers.map(esc).join(","),
    ...rows.map((r) => keys.map((k) => esc(r[k])).join(",")),
  ];
  return "﻿" + lines.join("\n"); // BOM
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export interface ChartCardProps {
  /** 슬롯 1: 카드 제목 */
  title: string;
  /** 슬롯 2: 부제(단위·기간 등). 선택 */
  subtitle?: string;
  /** 슬롯 3: 차트 본체(Recharts 엘리먼트). 미지정 시 data 로 기본 막대 차트 렌더 */
  children?: React.ReactNode;
  /** 슬롯 4: 설명 = 차트 영역의 alt(aria-label). 필수 */
  description: string;
  /** 슬롯 5: 데이터 출처·기준일. 필수 */
  source: string;
  /** 슬롯 6: 다운로드용 원본 데이터(CSV 생성). 필수 */
  data: Array<Record<string, unknown>>;
  /** CSV 열 정의(라벨/순서). 선택 */
  csvColumns?: Array<{ key: string; header: string }>;
  /** 다운로드 파일명 */
  downloadName?: string;
  /** children 미지정 시 기본 막대 차트가 쓰는 x/y 키 */
  xKey?: string;
  yKey?: string;
  /** 차트 높이(px) */
  height?: number;
  className?: string;
}

/**
 * 6슬롯을 강제하는 차트 카드.
 * children 으로 어떤 Recharts 차트든 넣을 수 있고, 생략하면 data + xKey/yKey 로
 * 규칙(직접 라벨링·수평 격자·tabular 축)에 맞는 기본 막대 차트를 그린다.
 */
export function ChartCard({
  title,
  subtitle,
  children,
  description,
  source,
  data,
  csvColumns,
  downloadName = "chart-data",
  xKey = "name",
  yKey = "value",
  height = 320,
  className = "",
}: ChartCardProps) {
  return (
    <figure
      className={`flex flex-col gap-16 rounded-lg bg-surface p-24 shadow-sm ${className}`}
    >
      {/* 슬롯 1·2: 제목 / 부제 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-title text-primary">{title}</h3>
        {subtitle ? <p className="text-label text-secondary">{subtitle}</p> : null}
      </div>

      {/* 슬롯 3: 차트 (role=img + aria-label = description) */}
      <div role="img" aria-label={description} className="w-full">
        {children ?? (
          <DefaultBar data={data} xKey={xKey} yKey={yKey} height={height} />
        )}
      </div>

      {/* 슬롯 4: 설명(=alt와 동일 문구) */}
      <figcaption className="text-body-dense text-secondary">{description}</figcaption>

      {/* 슬롯 5·6: 출처 / 다운로드 */}
      <div className="flex items-center justify-between gap-16 border-t border-[#E5E7EB] pt-12">
        <span className="text-caption text-tertiary">{source}</span>
        <button
          type="button"
          onClick={() => downloadCsv(downloadName, toCsv(data, csvColumns))}
          className="text-label text-primary underline underline-offset-2 hover:opacity-80"
        >
          데이터 다운로드(CSV)
        </button>
      </div>
    </figure>
  );
}

/** children 미지정 시 쓰이는 규칙 준수 기본 막대 차트 */
function DefaultBar({
  data,
  xKey,
  yKey,
  height,
}: {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  height: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 8 }}>
        {/* 수평 격자만, 저대비 (gridline 과다 금지) */}
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tick={{ fontSize: 14, fill: CHART_COLORS.axis }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fontSize: 14, fill: CHART_COLORS.axis }}
          tickFormatter={(v: number) => koNum(v)}
        />
        <Bar dataKey={yKey} fill={CHART_COLORS.focus} radius={[8, 8, 0, 0]} maxBarSize={48}>
          {/* 범례 대신 막대 끝 직접 라벨링 */}
          <LabelList
            dataKey={yKey}
            position="top"
            formatter={(v: number) => koNum(v)}
            style={{
              fontSize: 14,
              fill: CHART_COLORS.label,
              fontVariantNumeric: "tabular-nums",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChartCard;
