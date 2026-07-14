import * as React from "react";

/**
 * PageHeader — 페이지 상단 헤더 (한글 웹 규칙)
 *
 * 슬롯(고정): eyebrow? / title / description? / actions?
 * 근거: korean-design-foundation/references/component-slots.md
 *  - title       = headline(32px) + 0em tracking, text-primary
 *  - description = body(17px), text-secondary, 행 길이 제한(max-width)
 *  - eyebrow     = label(14px), text-secondary
 *
 * 토큰 유틸(korean-design-tokens가 theme에 확장):
 *  text-headline / text-title / text-body / text-label,
 *  text-primary / text-secondary, gap-*/p-* (px 스케일).
 */
export interface PageHeaderProps {
  /** 제목 위 짧은 분류/카테고리 라벨 */
  eyebrow?: React.ReactNode;
  /** 페이지 제목 (필수) */
  title: React.ReactNode;
  /** 제목 아래 설명 문장 (행 길이 제한됨) */
  description?: React.ReactNode;
  /** 우측 액션 영역 (버튼 등) */
  actions?: React.ReactNode;
  /** 제목 시맨틱 레벨 (기본 h1) */
  as?: "h1" | "h2";
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  as = "h1",
  className = "",
}: PageHeaderProps) {
  const Title = as;
  return (
    <header
      className={
        "flex flex-col gap-16 md:flex-row md:items-end md:justify-between " +
        className
      }
    >
      <div className="flex min-w-0 flex-col gap-8">
        {eyebrow ? (
          <p className="text-label text-secondary">{eyebrow}</p>
        ) : null}

        <Title className="text-headline text-primary">
          {title}
        </Title>

        {description ? (
          // 혼합 텍스트 45~65자 → 약 40rem으로 행 길이 제한
          <p className="max-w-[40rem] text-body text-secondary">{description}</p>
        ) : null}
      </div>

      {actions ? (
        // 액션은 줄바꿈 가능, 터치 하한은 각 버튼에서 min-h-[44px]로 보장
        <div className="flex shrink-0 flex-wrap items-center gap-8">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export default PageHeader;
