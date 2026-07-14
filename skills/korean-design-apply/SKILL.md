---
name: korean-design-apply
description: 한글/한국어 UI 디자인 작업의 진입점(front-door). 한국어 웹앱·랜딩·대시보드·차트·표·제안서·모바일앱을 (1)새로 만들거나 (2)외국·기존 템플릿을 한글에 맞게 고치거나 (3)기존 디자인을 규칙 대비 검수할 때 반드시 먼저 사용한다. "이거 한글에 맞게", "한국형 UI로", "한글 디자인", "한국어 화면", "한글 대시보드/랜딩/제안서 만들어줘", "한글로 바꿔줘", "한글 UI 검수해줘" 같은 요청에서 트리거. 이 스킬이 디자인 유형과 작업 모드를 감지해 올바른 전문 스킬·에이전트로 라우팅한다. 순수 영문·라틴 전용 디자인, 한글과 무관한 일반 코딩/백엔드 작업, 개별 수치 하나만 묻는 질문(→ korean-design-foundation 직접 조회)에는 트리거하지 않는다. 한글 맥락이 있으면 범용 미관 폴리싱(design-router·hallmark·make-interfaces-feel-better)보다 이 스킬이 우선한다. 반대로 한글 규칙과 무관한 순수 미관 개선, 텍스트 번역, 파일 포맷 변환(PPT→PDF 등)은 이 스킬이 아니라 design-router 또는 해당 도구로 보낸다.
---

# Korean Design Apply — 한글 디자인 하네스 오케스트레이터

이 스킬은 **라우터 겸 front-door**다. 직접 코드를 만들거나 검수하지 않는다. 대신 요청을 읽고 **디자인 유형**과 **작업 모드**를 감지한 뒤, 올바른 전문 스킬·에이전트에게 위임하고, 복합 작업이면 팀을 구성해 조율한다.

모든 수치·토큰의 근거는 `../korean-design-foundation/SKILL.md`와 그 `references/`다 (SSOT). 이 스킬은 값을 지어내지 않고, 판단이 애매하면 foundation을 다시 읽어 근거로 삼는다. 유형별 값이 충돌하면 `../korean-design-foundation/references/design-type-matrix.md`가 우선한다.

## 왜 라우터가 먼저인가

한글 디자인 요청은 대부분 "무엇을(유형)"과 "어떻게(모드)"가 섞여 들어온다. 유형·모드를 먼저 확정하지 않으면 전문가가 잘못된 규칙표를 적용한다(예: 제안서에 웹앱 본문 17px 적용). 그래서 이 스킬이 먼저 **감지 → 라우팅 → (필요 시) 팀 구성**을 수행한다. 생성/변환/검수 세 모드는 **같은 규칙표를 공유**한다 — 모드가 달라도 기준(foundation)은 동일하고, 산출물의 형태만 다르다.

---

## 1단계 — 감지 (유형 · 모드)

### (a) 디자인 유형 판별

요청의 명사·화면 성격으로 아래 7종 중 하나(또는 복합)를 고른다. 단서 키워드는 대표값이며, 상세 판별표는 `references/routing.md`에 있다.

| 유형 | 대표 단서 키워드 | 근거 규칙 위치 |
|---|---|---|
| 웹앱 | 화면, 관리자, 콘솔, 폼, 설정, 목록/상세, 대시보드 아님 | design-type-matrix "웹 앱" |
| 랜딩 | 랜딩페이지, 소개 페이지, hero, 마케팅 페이지, LP | design-type-matrix "랜딩 페이지" |
| 대시보드 | 대시보드, KPI, 지표 모음, 현황판, 관제/모니터링 | design-type-matrix "대시보드" |
| 차트 | 차트, 그래프, 시각화, 추이, 막대/선/원 그래프 | design-type-matrix "차트" + 차트 예외 규칙 |
| 표 | 표, 테이블, 목록형 데이터, 그리드, 명세표 | design-type-matrix "표" + 표 규칙 |
| 제안서 | 제안서, 발표자료, 피치덱, 슬라이드, PPT, 프레젠테이션 | design-type-matrix "제안서" |
| 모바일앱 | 모바일 앱, 앱 화면, iOS/Android, 네이티브 | design-type-matrix "모바일 앱" |

- **복합 유형**은 정상이다. "대시보드"는 거의 항상 대시보드+차트+표이고, "제안서에 차트 넣어줘"는 제안서+차트다. 하위 유형별 전문가를 함께 배치한다.
- 유형이 끝까지 모호하면(예: "웹페이지 만들어줘"가 웹앱인지 랜딩인지) 사용자에게 **1회만** 확인한다.

### (b) 작업 모드 판별

| 모드 | 하는 일 | 대표 단서 키워드 |
|---|---|---|
| **생성** | 새로 만든다 | 만들어줘, 생성, 제작, 구축, 새로, ~페이지/화면 만들어 |
| **변환** | 외국·기존 → 한글 규격화 | 한글에 맞게, 한국형으로, 한글화, 한글로 바꿔, 이 템플릿을 한글로, (기존 코드/URL/스샷 제시하며) 고쳐줘 |
| **검수** | 규칙 대비 리뷰 | 검수, 리뷰, 점검, 체크, 괜찮은지 봐줘, 규칙 대비, 뭐가 잘못됐어 |

- **변환·검수는 대상물이 있다.** 기존 코드 경로·URL·스크린샷이 함께 오면 생성이 아니라 변환/검수일 확률이 높다. 대상물 없이 "만들어"만 있으면 생성이다.
- 판별이 애매하면 대상물 유무를 우선 근거로 삼는다. 그래도 애매하면 1회 확인한다.

---

## 2단계 — 라우팅 표 (유형·작업 → 스킬 → 에이전트)

세 모드 모두 같은 스킬·에이전트로 라우팅된다. 모드는 산출물 형태만 바꾼다(생성=새 코드, 변환=수정 diff+근거, 검수=위반 항목+수정안).

| 유형/작업 | 스킬 | 에이전트 |
|---|---|---|
| 토큰·Tailwind·Style Dictionary (**모든 작업의 선행**) | `korean-design-tokens` | `korean-token-engineer` |
| 웹앱 · 랜딩 · 대시보드 · 모바일앱 레이아웃 | `korean-web-layout` | `korean-layout-designer` |
| 차트 · 표 (데이터 시각화) | `korean-dataviz` | `korean-dataviz-designer` |
| 제안서 (HTML 슬라이드) | `korean-proposal-slides` | `korean-proposal-designer` |
| 검수 · lint · 회귀 (**모든 모드에서 점진 실행**) | `korean-design-checks` | `korean-design-qa` |
| 라우팅·팀 구성·종합 (복합 작업) | (이 스킬) | `korean-design-lead` |
| 이미지 생성 · 브랜드 일관 비주얼 (AI 이미지 요청) | `brand-image-pipeline` | (전담 에이전트 없음 — 스킬 직접 로드) |
| 히어로 비주얼 · 아트디렉션 (hero 구도·이미지↔한글 헤드라인) | `hero-visual-art-direction` | (전담 에이전트 없음 — 스킬 직접 로드) |

- **모든 산출물은 `korean-design-foundation`을 근거로 삼는다.** 어떤 전문가도 임의 수치를 쓰지 않는다.
- **토큰이 선행**한다. 시각 값을 코드로 내기 전에 `korean-token-engineer`가 Tailwind theme·CSS 변수를 먼저 세팅해, 이후 전문가들이 `text-body`/`text-title`/`tracking-tight`/`p-16`/`bg-surface` 같은 토큰 유틸만 쓰게 한다.
- **검수는 마지막 1회가 아니라 각 모듈 완성 직후 점진 실행**한다(아래 런타임 참조).

라우팅 결정: 단일 유형·단순 작업이면 해당 전문가 **1명에게 직접 위임**한다. 복합 유형이거나 여러 모듈이 얽히면 `korean-design-lead`가 **팀을 구성**한다.

> 변경: 2026-07-03 P0-8 수정 — 위 표에 그래픽 라우팅 2행 추가, 아래 사용성 라우팅 절 신설.

### 사용성 라우팅 — 플로우·IA·폼·오류 회복

사용성/플로우/IA/폼/오류 회복 판단이 필요하면:

- **정본(SSOT)**: `../korean-design-foundation/references/usability-heuristics.md`
- **심층 참조**: `designing-beautiful-websites`(USABILITY·INTERACTION-DESIGN·INFORMATION-ARCHITECTURE 섹션) + `ui-ux-pro-max` §8 Forms·§9 Navigation — ui-ux-pro-max는 App UI 스코프이므로 **웹 번안 적용**.
- **수치는 foundation**: 심층 참조가 제시하는 값이 foundation과 다르면 foundation(`design-type-matrix.md` 포함)이 우선한다.

상세 표와 신규 foundation references 목록은 `references/routing.md` §3-1·§3-2 참조.

---

## 3단계 — 런타임 = 에이전트 팀

이 하네스의 런타임은 스크립트가 아니라 **협업하는 에이전트 팀**이다. `korean-design-lead`가 팀을 만들고 의존성 있는 작업을 배분하며, 팀원은 서로 메시지로 조율하고, `korean-design-qa`가 완성 순서대로 점진 검증한다.

### 단일·단순 작업 — 전문가 1명 위임

예: "한글 차트 하나만 만들어줘", "이 표 한글 규격으로 검수해줘".
- 팀을 만들지 않는다. 해당 전문가에게 유형·모드·스택·근거 파일 경로를 담아 위임한다.
- 완성 후 `korean-design-qa`에 해당 모듈 검증을 1회 요청한다(대상이 코드/렌더면).

### 복합 작업 — 팀 구성

예: "한글 대시보드 만들어줘"(대시보드+차트+표), "이 영문 제안서를 한글로 고치고 차트도 손봐줘".

`korean-design-lead`가 다음을 수행한다:

1. **TeamCreate** — 필요한 전문가만 팀에 배치한다(과잉 구성 금지, 팀 크기 가이드 참조).
2. **TaskCreate** — 의존성을 명시해 작업을 할당한다. 전형적 의존 사슬:
   `토큰(korean-token-engineer)` → `레이아웃(korean-layout-designer)` → `차트·표(korean-dataviz-designer)` / `제안서(korean-proposal-designer)` → 각 단계 직후 `검수(korean-design-qa)`.
3. **SendMessage** — 팀원 간 경계면(카드 크기·그리드 셀·필요 토큰 이름·차트 슬롯 규격)을 서로 메시지로 맞춘다. 예: dataviz가 layout에게 ChartCard 최소 폭/높이를 회신, layout이 dataviz에게 그리드 셀 규격을 통지.
4. **점진 QA** — 각 모듈이 끝날 때마다 `korean-design-qa`가 즉시 검증한다. 전체 완료 후 1회 몰아서 검수하지 않는다 — 문제를 조기에 잡아 재작업을 줄인다. FAIL은 해당 전문가에게 되돌려 1회 재수정한다.
5. **종합** — lead가 산출물을 합치고 QA 결과(PASS/FAIL)를 붙여 사용자에게 전달한다.

### 팀 크기 가이드

| 규모 | 인원 | 예시 |
|---|---|---|
| 소 | 2~3 | 랜딩 생성 = token-engineer + layout-designer + qa |
| 중 | 3~5 | 대시보드 생성 = token + layout + dataviz + qa (+lead) |
| 대 | 5~7 | 풀 산출(대시보드+제안서 or 디자인 시스템) = token + layout + dataviz + proposal + qa + lead |

인원은 **실제 필요한 최소**로 잡는다. 차트·표·KPI가 없으면 dataviz를 부르지 않고, 슬라이드가 없으면 proposal을 부르지 않는다.

---

## 데이터 전달 프로토콜

산출물과 조율 정보는 **파일 + 태스크 + 메시지**의 조합으로 전달한다.

- **중간 산출물**은 `_workspace/{phase}_{agent}_{artifact}.{ext}`에 저장한다.
  - 예: `_workspace/01_token-engineer_tailwind.preset.js`, `_workspace/02_layout-designer_dashboard.tsx`, `_workspace/03_dataviz-designer_revenue-chartcard.tsx`, `_workspace/04_qa_report.md`.
  - `phase`는 의존 순서(01, 02 …), `agent`는 작성 전문가, `artifact`는 내용물.
- **최종 산출물만** 사용자 지정 경로에 쓴다. `_workspace/`는 중간 작업 공간이며 최종 전달물이 아니다.
- **태스크(TaskCreate)** 로 "무엇을·어떤 의존성으로" 를 표현하고, **메시지(SendMessage)** 로 "경계면 합의·발견 공유"를 표현하며, **파일**로 "실제 산출물"을 전달한다.
- 전문가는 상류 산출물(예: 토큰 preset)의 경로를 지시에서 받아 그 토큰 이름만 참조한다 — raw px/hex 재발명 금지.

---

## 에러 핸들링

- **전문가 실패**: 1회 재시도한다. 그래도 실패하면 그 결과 없이 진행하되 **최종 보고에 누락을 명시**한다("차트 모듈 미완성 — 원인·다음 조치"). 조용히 빠뜨리지 않는다.
- **규칙 충돌**: 삭제하지 않고 **출처를 병기**한 뒤 `design-type-matrix.md` 기준으로 택한다(예: 본문 크기 웹 17px vs 제안서 18pt → 유형이 제안서면 18pt, 근거 병기).
- **도구 미설치**(lint/axe/Playwright 등): `korean-design-qa`가 설치 안내 또는 수동 체크리스트로 폴백하고 그 사실을 명시한다. 검사 통과를 증명 없이 선언하지 않는다.
- **유형·모드 모호**: 1단계 판별로 확정되지 않으면 사용자에게 **1회만** 확인한다(웹앱 vs 랜딩, 생성 vs 변환 등). 무한 되묻기 금지.

---

## references/ — 상세 조회 (필요할 때만 로드)

- **`references/routing.md`** — 유형·모드 판별 상세 단서, 복합 시나리오 분해 예(대시보드 생성 = token+layout+dataviz+qa 등), 팀 구성·의존 사슬 예시.
- **`references/test-scenarios.md`** — 정상 흐름 1개(한글 대시보드 생성)와 에러 흐름 1개(유형 모호/도구 미설치)의 단계별 기대 동작. 라우팅 회귀 확인용.

## 이 스킬을 쓰는 법 (요약)

1. 요청에서 **유형 + 모드**를 감지한다(1단계). 애매하면 대상물 유무 → 그래도 애매하면 1회 확인.
2. 라우팅 표로 스킬·에이전트를 정한다(2단계). 토큰은 선행, 검수는 점진.
3. 단순하면 전문가 1명, 복합이면 `korean-design-lead`가 팀 구성(3단계).
4. 중간 산출은 `_workspace/`, 최종만 사용자 경로. 모든 값은 foundation 근거.
