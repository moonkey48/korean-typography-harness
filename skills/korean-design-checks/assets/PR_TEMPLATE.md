<!--
  korean-design-checks — PR 검수 템플릿
  근거: korean-design-foundation/references/qa-checklist.md ("PR 템플릿에 넣을 항목" + 마스터 체크리스트).
  체크는 "토큰이 존재하는가"가 아니라 "이 변경의 경계면(소스↔토큰↔렌더)이 실제로 통과했는가" 기준.
  FAIL 은 근거 수치(expected vs actual)와 수정 제안을 함께 적는다.
-->

## 무엇을 바꿨나
<!-- 화면/컴포넌트/토큰 변경 요약 -->

## 자동 게이트 결과 (붙여넣기)
- [ ] `npm run lint:kd` (ESLint) — 통과 / 실패:
- [ ] `npm run lint:kd:css` (stylelint) — 통과 / 실패:
- [ ] `playwright test a11y.playwright.spec.ts` (axe + 확대) — 통과 / 실패:
- [ ] Storybook addon-a11y — 통과 / 실패 / N-A:

## Blocking 체크 (하나라도 FAIL 이면 머지 금지)
- [ ] **본문 16px 이상** (예외: dense table 15px). 하드코딩 px 없음, 토큰 유틸(text-body / text-body-dense) 사용.
- [ ] **토큰 외 spacing 없음** (4·8·12·16·24·32·40·48·64 만; arbitrary `p-[..]` 없음).
- [ ] **자간 오버튜닝 없음** (한글 본문/라벨 0em, 제목도 기본 0em. 비영 자간은 검수 근거 필요).
- [ ] **색 대비 통과** (일반 4.5:1 / 큰 텍스트 3:1 / 비텍스트 3:1 — axe color-contrast 위반 0).
- [ ] **200% 확대 무손실** (대시보드/웹은 400%=320px 리플로우까지). 페이지 가로 스크롤 없음.
- [ ] **터치 목표** iOS 44pt / Android 48dp 이상.

## 경고 체크 (리뷰에서 판정, 사유 기록)
- [ ] **raw hex 직접 사용 없음** → 토큰(var(--color-...) / text-primary·bg-surface) 참조.
- [ ] **줄간격** 본문 1.5 이상.
- [ ] **차트 규칙**: 시리즈 ≤4, stacked 4범주 이내, gridline ≤10, 색 5개 미만.
- [ ] **차트 카드 6슬롯**: title / subtitle / chart / description / source / download (description·source·download 생략 불가).
- [ ] **표 규칙**: 숫자 우정렬 · 텍스트 좌정렬 · 셀 3줄 이내 · vertical line 지양.
- [ ] **행 길이 max-width** (BodyBlock: 한글 24~34자 / 혼합 45~65자).

## FAIL 상세 (있으면)
| 항목 | 위치 | expected | actual | 수정 |
|---|---|---|---|---|
| | | | | |

## disable / 예외 (있으면 사유 필수)
<!-- eslint-disable / stylelint-disable / N-A 처리한 항목과 사유 -->
