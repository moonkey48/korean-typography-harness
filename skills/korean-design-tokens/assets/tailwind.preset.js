/**
 * Korean Design — Tailwind preset
 * ---------------------------------------------------------------------------
 * SSOT: ../../korean-design-foundation/references/tokens.dtcg.json
 * 이 파일의 모든 값은 위 DTCG에서 온다. 손으로 값을 바꾸지 말 것.
 * 값이 바뀌면 DTCG를 고치고 scripts/build-tokens.sh 로 재생성하거나 이 파일을 갱신한다.
 *
 * 사용:
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require("./tailwind.preset.js")],
 *     content: ["./src/** /*.{js,ts,jsx,tsx}"],
 *   };
 *
 * 유틸 네이밍 규약(고정): text-body / text-title 등은 크기+줄간격+자간을 함께 적용한다.
 *   spacing 은 "숫자 = px" 로 재정의된다 → p-4 = 4px (기본 Tailwind 의 1rem 이 아님).
 */

const fontSans = [
  '"Pretendard Variable"',
  "Pretendard",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Apple SD Gothic Neo"',
  '"Noto Sans KR"',
  '"Malgun Gothic"',
  "sans-serif",
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    // breakpoint 는 정본 5종으로 완전히 대체한다 (기본 sm/md/lg/xl/2xl 제거).
    screens: {
      sm: "360px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1440px",
    },
    extend: {
      fontFamily: {
        sans: fontSans,
      },
      // font.weight — regular/medium/bold 3단계면 충분.
      fontWeight: {
        regular: "400",
        medium: "500",
        bold: "700",
      },
      // 타입 토큰: [size, { lineHeight, letterSpacing }]. text-* 한 번에 3속성 적용.
      fontSize: {
        caption: ["13px", { lineHeight: "1.45", letterSpacing: "0em" }],
        label: ["14px", { lineHeight: "1.45", letterSpacing: "0em" }],
        body: ["17px", { lineHeight: "1.6", letterSpacing: "0em" }],
        "body-dense": ["15px", { lineHeight: "1.5", letterSpacing: "0em" }],
        title: ["24px", { lineHeight: "1.45", letterSpacing: "0em" }],
        headline: ["32px", { lineHeight: "1.4", letterSpacing: "0em" }],
        display: ["44px", { lineHeight: "1.3", letterSpacing: "0em" }],
      },
      // 수동 자간. 기본은 0이며 tight/tighter 는 렌더링 검수 후 짧은 제목에만 선택적으로 쓴다.
      letterSpacing: {
        normal: "0em",
        tight: "-0.01em",
        tighter: "-0.015em",
      },
      // 간격: 숫자 = px. 4/8 스케일만. p-4=4px, gap-24=24px ...
      spacing: {
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        40: "40px",
        48: "48px",
        64: "64px",
      },
      colors: {
        // 텍스트 역할색 → text-primary / text-secondary / text-tertiary
        primary: "#111111",
        secondary: "#4B5563",
        tertiary: "#6B7280",
        // 표면색 → bg-surface / bg-surface-muted / bg-surface-elevated
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F8FA",
          elevated: "#FFFFFF",
        },
        // 차트색 → fill-chart-1 / stroke-chart-focus / text-chart-muted ...
        chart: {
          1: "#2563EB",
          2: "#059669",
          3: "#D97706",
          4: "#7C3AED",
          focus: "#2563EB",
          muted: "#9CA3AF",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
    },
  },
};
