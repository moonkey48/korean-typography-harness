import * as React from "react";

/**
 * BodyBlock — 긴 본문 블록 (한글 행 길이 제어)
 *
 * 슬롯(고정): heading? / body(children)
 * 규칙: max-width 필수. 없으면 넓은 화면에서 행이 길어져 가독성이 붕괴한다.
 * 근거: korean-design-foundation/references/component-slots.md,
 *       design-type-matrix.md(6. 행 길이 규칙)
 *  - 한글 문장 24~34자  → measure="korean" (기본, 약 32rem)
 *  - 혼합 텍스트 45~65자 → measure="mixed"  (약 40rem)
 *  - body     = body(17px, line-height 1.6), text-primary
 *  - heading  = title(24px) + 0em tracking, text-primary
 *
 * 토큰 유틸: text-body / text-title, text-primary, mb-* (px 스케일).
 */
export interface BodyBlockProps {
  /** 블록 제목 */
  heading?: React.ReactNode;
  /** 행 길이 프리셋: 한글 위주 vs 한/영/숫자 혼합 */
  measure?: "korean" | "mixed";
  /** 제목 시맨틱 레벨 (기본 h2) */
  as?: "h2" | "h3";
  /** 본문 내용 */
  children: React.ReactNode;
  className?: string;
}

const MEASURE_MAX_WIDTH: Record<NonNullable<BodyBlockProps["measure"]>, string> =
  {
    // 한글 24~34자 기준
    korean: "32rem",
    // 혼합 45~65자 기준
    mixed: "40rem",
  };

export function BodyBlock({
  heading,
  measure = "korean",
  as = "h2",
  children,
  className = "",
}: BodyBlockProps) {
  const Heading = as;
  return (
    <section
      className={className}
      // max-width는 프리셋 값으로 강제 — 행 길이 붕괴 방지
      style={{ maxWidth: MEASURE_MAX_WIDTH[measure] }}
    >
      {heading ? (
        <Heading className="mb-16 text-title text-primary">
          {heading}
        </Heading>
      ) : null}

      <div className="text-body text-primary">{children}</div>
    </section>
  );
}

export default BodyBlock;
