# 컴포넌트 슬롯 정의

패턴 라이브러리는 "컴포넌트 모음"이 아니라 **한국어 텍스트가 들어와도 망가지지 않는 조합의 집합**이다. 핵심은 외형이 아니라 **텍스트 슬롯의 역할 고정**이다. 슬롯이 고정되면 대체 텍스트·소스·다운로드까지 일관되게 들어간다.

## 기본 6종 (이것만 잘해도 제안서·랜딩·대시보드·웹앱의 70%+ 커버)

### 1. PageHeader
- 슬롯: `eyebrow?` / `title` / `description?` / `actions?`
- title = headline(32px), description = body(17px, secondary).

### 2. SectionHeader
- 슬롯: `title` / `description?` / `action?`
- title = title(24px). 섹션 상단 여백 = space.section.

### 3. BodyBlock
- 슬롯: `heading?` / `body`
- **max-width 필수** (한글 24~34자 / 혼합 45~65자). 없으면 넓은 화면에서 행 길이 붕괴.
- body = body(17px, lh 1.6).

### 4. KpiCard — **4슬롯**
- `eyebrow` / `metric` / `delta` / `help`
- metric = display(44px, tabular-nums), delta = label(14px, 상승/하락 색+아이콘), help = caption(13px).

### 5. ChartCard — **6슬롯 (필수)**
- `title` / `subtitle` / `chart` / `description` / `source` / `download`
- description·source·download는 접근성·공공 분석 가이드 요구사항 — **생략 불가**.
- title = title(24px), subtitle = label, source/download = caption.

### 6. TableWrapper
- 슬롯: `title` / `description?` / `source?` / `download?` / `table`
- 숫자 우정렬·텍스트 좌정렬·셀 3줄 이내·vertical line 지양을 강제.
- 좁을 때 카드형 전환 or 가로 스크롤 + 헤더 고정.

## 확장 세트

- **FieldGroup / FormField**: `label` / `input` / `help?` / `error?`. label 14px, help/error caption.
- **EmptyState**: `icon?` / `title` / `description` / `action?`.
- **FilterBar**: `filters[]` / `reset?`. 요소 간격 8/12/16.
- **MetricDelta**: 상승/하락/보합 3상태, 색+방향아이콘+수치. 색 단독 금지.

## 토큰 지배 원칙

모든 슬롯의 크기·간격·색은 **foundation 토큰을 통과**해야 한다. 컴포넌트가 raw px/hex를 직접 쓰면 안 된다. 타이포 토큰과 간격 토큰이 슬롯 구조를 지배하고, 모든 시각 결정이 이 토큰을 통과하도록 만든다.

## 토큰 계층

```
Foundation Tokens (font, type-scale, line-height, tracking, space, breakpoint, color)
        ↓
Semantic Tokens (text.primary/secondary/tertiary, space.section/card/inline,
                 surface.default/muted/elevated, chart.categorical/sequential/focus)
        ↓
Component Patterns (PageHeader, BodyBlock, KpiCard, ChartCard, TableWrapper, FormField ...)
```
