<!--
  korean-design-checks — 디자인 리뷰 템플릿 (단계 1 디자인 · 단계 2 핸드오프)
  근거: korean-design-foundation/references/qa-checklist.md ("디자인 리뷰 템플릿에 넣을 항목" + 마스터 체크리스트),
        references/component-slots.md, references/design-type-matrix.md.
  정적 lint/axe 로 못 잡는 것(시안 값·슬롯 충족·행 길이·자간 오버튜닝)을 사람이 판정한다.
  각 항목 PASS / FAIL / N-A. FAIL 은 근거 수치와 수정 제안을 적는다.
-->

## 대상
- 화면/컴포넌트:
- 유형(제안서 / 차트 / 표 / 랜딩 / 대시보드 / 웹앱 / 모바일앱):
- 시안 링크(Figma 등):

## 단계 1 — 디자인 검수 (시안 ↔ 토큰 교차 비교)
- [ ] **본문 크기**: 유형 기준 충족 (웹/랜딩 16~17px, 대시보드 14~16, 표 15/14, 제안서 18pt / 라이브 24pt+, 모바일 16sp). PASS/FAIL:
- [ ] **줄간격**: 본문 1.5 이상, 긴 문단 1.6 내외, 디스플레이급 1.3~1.45. PASS/FAIL:
- [ ] **한글 자간 오버튜닝 없음**: 본문/라벨 0em, 제목도 기본 0em. 비영 자간은 프로젝트 서체 기준과 렌더링 검수 근거가 있을 때만 제한 사용. PASS/FAIL:
- [ ] **제목:본문 비율** 1.25~1.5배 (미세 차이 다수 스타일 아님, 6~8 토큰 이내). PASS/FAIL:
- [ ] **색 대비** 일반 4.5:1 / 큰 3:1 / 비텍스트 3:1. text.tertiary(#6B7280) 본문 사용 금지. PASS/FAIL:
- [ ] **마진/거터/컬럼** 토큰·그리드 준수 (small 4–6 / medium 8–12 / large 12–16, 마진 small 16·medium+ 24, 거터 ≥16 권장 24). PASS/FAIL:

## 단계 1 — 컴포넌트 슬롯 충족 (component-slots.md)
- [ ] **ChartCard 6슬롯**: title / subtitle / chart / description / source / download — description·source·download 생략 불가. PASS/FAIL:
- [ ] **TableWrapper**: title / (description?) / (source?) / (download?) / table. 숫자 우정렬·텍스트 좌정렬·셀 3줄 이내·vertical line 지양. PASS/FAIL:
- [ ] **KpiCard 4슬롯**: eyebrow / metric / delta / help. metric tabular-nums, delta 색+아이콘(색 단독 금지). PASS/FAIL:
- [ ] **BodyBlock max-width**: 행 길이 한글 24~34자 / 혼합 45~65자. 없으면 넓은 화면에서 행 붕괴. PASS/FAIL:

## 단계 1 — 차트/표/대시보드 규칙 (design-type-matrix.md)
- [ ] **차트 시리즈** ≤4, stacked 4범주 이내, clustered 4막대 이내, gridline ≤10, 색 5개 미만·인접 대비 3:1. PASS/FAIL:
- [ ] **차트 대체 정보**: alt 설명 · 데이터 소스 · 데이터 다운로드 제공. PASS/FAIL:
- [ ] **표 반응형**: 좁을 때 카드형 전환 또는 가로 스크롤 + 헤더 고정, 큰 표 pagination, 모달 내 큰 표 금지. PASS/FAIL:
- [ ] **대시보드 구조**: 중요 지표 상단(inverted pyramid), horizontal scroll 회피, 내부 스크롤 지양. PASS/FAIL:

## 단계 2 — 핸드오프 검수 (시안 ↔ 코드 계약)
- [ ] 모든 값이 **토큰 이름**으로 표현됨(raw px/hex 아님): 역할(body/title…) ↔ 유틸(text-body / text-title …). PASS/FAIL:
- [ ] spacing 은 토큰 스케일 이름으로 지정(p-4 등), arbitrary 값 없음. PASS/FAIL:
- [ ] 색은 시맨틱 토큰(text-primary/secondary/tertiary, bg-surface / bg-surface-muted, chart.categorical.1~4 / chart.focus / chart.muted). PASS/FAIL:
- [ ] 확대/터치 요건이 스펙에 명시(200%·400%, 44/48). PASS/FAIL:

## FAIL 상세
| 항목 | 위치 | expected | actual | 수정 |
|---|---|---|---|---|
| | | | | |

## 상충/예외 (삭제 말고 병기)
<!-- 유형 매트릭스가 SSOT 기본값과 다른 경우 등 — 출처 병기 후 유형 매트릭스 우선 -->
