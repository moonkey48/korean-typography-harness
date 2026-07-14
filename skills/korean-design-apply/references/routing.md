# 라우팅 상세 — 유형·모드 판별과 팀 구성

> `../SKILL.md`의 감지·라우팅을 확장한 참조 문서. 모든 수치의 근거는 `../../korean-design-foundation/`이며, 유형별 값 충돌 시 `../../korean-design-foundation/references/design-type-matrix.md`가 우선한다.

## 목차
1. 디자인 유형 판별 상세 단서
2. 작업 모드 판별 상세 단서
3. 유형 → 스킬·에이전트 매핑 (전개)
   - 3-1. 그래픽 라우팅 (이미지 생성·히어로 비주얼) — P0-8 추가
   - 3-2. 사용성 라우팅 (플로우·IA·폼·오류 회복) — P0-8 추가
4. 복합 시나리오 분해 예
5. 팀 구성·의존 사슬 예시
6. 판별 우선순위 & 폴백 규칙

---

## 1. 디자인 유형 판별 상세 단서

7종 유형. 애매하면 "화면 성격"과 "데이터 밀도"를 기준으로 좁힌다.

| 유형 | 강한 단서 | 약한 단서(맥락 필요) | 흔한 오분류 → 교정 |
|---|---|---|---|
| 웹앱 | 관리자, 콘솔, 폼, 설정, 목록/상세, CRUD, 로그인 후 화면 | "웹페이지", "화면", "서비스" | 랜딩으로 오분류 → 로그인 뒤/입력 중심이면 웹앱 |
| 랜딩 | 랜딩페이지, LP, hero, 소개/마케팅 페이지, CTA 유도 | "홈페이지", "메인" | 웹앱으로 오분류 → 방문자 설득·스크롤형이면 랜딩 |
| 대시보드 | 대시보드, KPI, 지표 모음, 현황판, 관제, 모니터링 | "한눈에 보기", "요약 화면" | 차트 단품으로 오분류 → 지표+차트+표 묶음이면 대시보드 |
| 차트 | 차트, 그래프, 추이, 막대/선/원, 시각화 | "보여줘", "비교" | 표로 오분류 → 값의 크기·추세 비교면 차트 |
| 표 | 표, 테이블, 명세, 목록형 데이터, 그리드(데이터) | "정리해줘", "리스트" | 차트로 오분류 → 정확한 값 나열·정렬·검색이면 표 |
| 제안서 | 제안서, 발표자료, 피치덱, 슬라이드, PPT, 프레젠테이션 | "덱", "보고자료" | 랜딩으로 오분류 → 투사·발표 맥락이면 제안서 |
| 모바일앱 | 모바일 앱, 앱 화면, iOS/Android, 네이티브, 하단탭 | "앱", "폰에서" | 웹앱으로 오분류 → 네이티브/터치 우선이면 모바일앱 |

### 유형별 핵심 규칙 요지 (design-type-matrix 근거)
- **웹앱**: 본문 16~17px, 컬럼 KRDS small 4–6 / medium 8–12 / large 12–16, 회색 본문 남용 금지.
- **랜딩**: 본문 17~18px, Hero 44/60px, 모바일4/tablet8/desktop12, **BodyBlock max-width 필수**.
- **대시보드**: inverted pyramid(중요 지표 상단), 카드 간격 16~24px, horizontal scroll·내부 스크롤 회피.
- **차트**: 시리즈 ≤4, gridline ≤10, categorical 색 5색 미만·인접 대비 3:1, 범례보다 직접 라벨링, alt·source·download 필수.
- **표**: 숫자 우정렬·텍스트 좌정렬, 셀 3줄 이내, vertical line 지양, 셀 패딩 12×16, 행 높이 44~48px.
- **제안서**: 본문 18pt(라이브 24pt+), 1920×1080, 좌우 96/상하 64px, 12컬럼·거터 24px, **투사 거리 우선**, 왼쪽 정렬.
- **모바일앱**: Body 16pt/sp, 터치 iOS 44pt/Android 48dp 이상, Compact<600 / Medium 600–839 / Expanded 840+.

---

## 2. 작업 모드 판별 상세 단서

| 모드 | 신호 | 대상물 | 산출물 형태 |
|---|---|---|---|
| 생성 | "만들어줘/생성/제작/구축/새로", 대상물 없음 | 없음(요구사항만) | 새 React+Tailwind 코드 / HTML 슬라이드 |
| 변환 | "한글에 맞게/한국형/한글화/한글로 바꿔", 외국·기존 대상 제시 | 기존 코드·URL·스샷·템플릿 | 수정 diff + 변경 근거(어떤 규칙 위반을 어떻게 고쳤는지) |
| 검수 | "검수/리뷰/점검/체크/괜찮은지/뭐가 잘못됐어" | 기존 코드·렌더·디자인 | 위반 항목표(항목·근거 수치·위치·수정안) + PASS/FAIL |

- **대상물 유무가 1차 판별 근거**다. 대상물이 있으면 생성이 아니다. "고쳐줘"는 대상물이 외국식이면 변환, 규칙 준수 여부를 물으면 검수다.
- 세 모드는 **동일한 foundation 규칙표**를 쓴다. 모드는 라우팅 대상 전문가를 바꾸지 않고, 그 전문가의 산출물 형태만 바꾼다.
- 변환·검수는 거의 항상 `korean-design-qa`의 점진 검증을 동반한다(변환은 고친 뒤 재검, 검수는 그 자체가 QA).

---

## 3. 유형 → 스킬·에이전트 매핑 (전개)

| 유형 | 선행 | 주 담당 | 보조 담당 | 마감 |
|---|---|---|---|---|
| 웹앱 | korean-token-engineer / korean-design-tokens | korean-layout-designer / korean-web-layout | (표·차트 있으면) korean-dataviz-designer | korean-design-qa / korean-design-checks |
| 랜딩 | korean-token-engineer | korean-layout-designer | (지표 카드 있으면) korean-dataviz-designer | korean-design-qa |
| 대시보드 | korean-token-engineer | korean-layout-designer | korean-dataviz-designer (차트·표·KPI) | korean-design-qa |
| 차트 | korean-token-engineer | korean-dataviz-designer | (배치 필요 시) korean-layout-designer | korean-design-qa |
| 표 | korean-token-engineer | korean-dataviz-designer | (배치 필요 시) korean-layout-designer | korean-design-qa |
| 제안서 | korean-token-engineer | korean-proposal-designer | (차트·표 있으면) korean-dataviz-designer | korean-design-qa |
| 모바일앱 | korean-token-engineer | korean-layout-designer | korean-dataviz-designer | korean-design-qa |

- **토큰은 항상 선행**한다. 토큰 preset(예: `_workspace/01_token-engineer_tailwind.preset.js`)이 나온 뒤에야 다른 전문가가 `text-body`·`text-title`·`tracking-tight`·`p-16`·`bg-surface-muted` 같은 토큰 유틸을 쓴다.
- **검수는 마감이자 각 모듈 직후 점진 실행**된다 — 마지막 한 번이 아니다.
- 라우팅은 `korean-design-lead`가 결정한다. 단일 유형·단순 작업이면 주 담당 1명 + 마감 QA로 끝낸다.

> 변경: 2026-07-03 P0-8 수정 — 아래 3-1(그래픽)·3-2(사용성) 절 신설.

### 3-1. 그래픽 라우팅 (이미지 생성·히어로 비주얼)

이미지 생성/히어로 비주얼 요청은 아래 스킬로 분기한다.

| 요청 신호 | 스킬 | 비고 |
|---|---|---|
| 이미지 생성, AI 이미지, 브랜드 일관 이미지, 온브랜드 비주얼, 일러스트·사진 소재 생성 | `brand-image-pipeline` | 브랜드 일관 AI 이미지(레퍼런스 고정 워크플로·oklch 토큰 팔레트 주입·후처리 필수) |
| 히어로 비주얼, hero 구도/구성, 메인 비주얼, 이미지↔한글 헤드라인 통합 | `hero-visual-art-direction` | 히어로 구도 체계(초점 계층·레이어 깊이)·keep-all 오버레이 |

- 생성된 이미지가 페이지에 배치되면 행길이·오버레이·그리드 규칙은 `korean-web-layout`이, 최종 검수는 `korean-design-qa`가 마감한다.

### 3-2. 사용성 라우팅 (플로우·IA·폼·오류 회복)

사용성/플로우/IA/폼/오류 회복 판단이 필요하면:

- **정본(SSOT)**: `../../korean-design-foundation/references/usability-heuristics.md`
- **심층 참조**: `designing-beautiful-websites`(USABILITY·INTERACTION-DESIGN·INFORMATION-ARCHITECTURE) + `ui-ux-pro-max` §8 Forms·§9 Navigation — 원본이 App UI 스코프이므로 **웹 번안 적용**.
- **수치는 foundation** — 심층 참조와 값이 충돌하면 foundation(`design-type-matrix.md` 포함)이 우선한다.

#### 신규 foundation references 3종 (P0-8 기준 존재 — 라우팅 근거로 인용)

`../../korean-design-foundation/references/`에 다음 3종이 추가되어 있으며, 각 전문가는 해당 판단 시 이를 근거로 인용한다.

| 파일 | 용도 |
|---|---|
| `usability-heuristics.md` | 사용성/플로우/IA/폼/오류 회복 판단의 정본 (Nielsen 10 웹 번안) |
| `korean-forms.md` | 한국 폼 관례(휴대폰 010 3-4-4·주소검색·사업자번호·본인인증·조사 안전 라벨) |
| `korean-number-date-units.md` | 숫자·날짜·단위 표기(만/억 그루핑·`YYYY.MM.DD`·원/명/건) + 동적 조사 헬퍼 |

---

## 4. 복합 시나리오 분해 예

### 예 A — "한글 대시보드 만들어줘" (대시보드 생성)
분해: 대시보드 = 레이아웃 골격 + KPI 카드 + 차트 + 표.
- 유형: 대시보드(+차트+표+KPI) / 모드: 생성.
- 팀(중, 4~5): token-engineer → layout-designer → dataviz-designer → qa (+lead 조율).
- 의존 사슬: 토큰 세팅 → 그리드/카드 레이아웃(inverted pyramid) → 각 ChartCard(6슬롯)·TableWrapper·KpiCard 채우기 → 모듈별 QA.

### 예 B — "이 영문 랜딩 템플릿을 한글에 맞게 고쳐줘" (랜딩 변환)
분해: 기존 코드 대상 → 토큰 정합성 점검 + 레이아웃 한글화(본문 17~18px, hero tracking, BodyBlock max-width) + 검수.
- 유형: 랜딩 / 모드: 변환.
- 팀(소, 2~3): token-engineer(토큰 정합) → layout-designer(수정 diff) → qa(재검).
- 산출물: 수정 diff + "영문형 과대 tracking·행 길이 붕괴를 어떤 토큰으로 교정했는지" 근거.

### 예 C — "한글 제안서에 매출 차트 넣어서 만들어줘" (제안서+차트 생성)
- 유형: 제안서(+차트) / 모드: 생성.
- 팀(중, 4): token-engineer → proposal-designer(슬라이드 골격, 18pt/24pt+, 왼쪽 정렬) → dataviz-designer(대형·저밀도 차트, 축소 금지) → qa.
- 경계면: proposal이 dataviz에 "슬라이드용 대형 차트 규격"을 SendMessage로 요청.

### 예 D — "우리 대시보드 규칙에 맞는지 검수해줘" (대시보드 검수)
- 유형: 대시보드 / 모드: 검수.
- 팀(소, 1~2): qa 단독(필요 시 lead). 도구(lint/axe/Playwright) 실행 → 항목별 PASS/FAIL + 근거 수치.

---

## 5. 팀 구성·의존 사슬 예시

`korean-design-lead`의 전형적 오케스트레이션(예 A 기준):

1. **TeamCreate**: [token-engineer, layout-designer, dataviz-designer, qa].
2. **TaskCreate**(의존성):
   - T1 토큰 세팅 (token-engineer) — 산출 `_workspace/01_token-engineer_tailwind.preset.js`.
   - T2 대시보드 레이아웃 (layout-designer, **T1 의존**) — `_workspace/02_layout-designer_dashboard.tsx`.
   - T3 차트·표·KPI (dataviz-designer, **T1·T2 의존**) — `_workspace/03_dataviz-designer_cards.tsx`.
   - T4 점진 검수 (qa, **각 모듈 직후**) — `_workspace/04_qa_report.md`.
3. **SendMessage**(경계면 합의):
   - layout → dataviz: 그리드 셀·카드 슬롯 크기 통지.
   - dataviz → layout: ChartCard 최소 폭/높이 회신(레이아웃이 셀을 조정).
   - token-engineer → 전원: 생성한 토큰/유틸 이름 목록 공유.
4. **점진 QA**: T1 끝나면 토큰↔산출 대조 검증, T2 끝나면 레이아웃 검증, T3 끝나면 차트 규칙·표 정렬·alt 유무 검증. FAIL은 해당 전문가에 1회 되돌림.
5. **종합**: lead가 합쳐 최종 경로에 쓰고 QA 요약 첨부.

---

## 6. 판별 우선순위 & 폴백 규칙

1. **대상물 유무 → 모드**: 대상물 있으면 변환/검수, 없으면 생성.
2. **명사·화면 성격 → 유형**: 표의 강한 단서 우선, 약한 단서는 맥락으로 보강.
3. **복합이면 분해**: 하위 유형별 전문가를 함께 배치(과잉 금지, 최소 인원).
4. **끝까지 모호하면 1회 확인**: 유형(웹앱 vs 랜딩)·모드(생성 vs 변환) 중 확정 안 되는 축만 짧게 되묻는다. 무한 되묻기 금지.
5. **규칙 충돌**: 삭제하지 않고 출처 병기, `design-type-matrix.md` 기준으로 택함.
6. **전문가/도구 실패**: 1회 재시도 → 재실패 시 누락 명시하고 진행. 증명 없이 통과 선언 금지.
