---
name: korean-proposal-slides
description: 한글 제안서·프레젠테이션·발표자료·피치덱·IR/제안 슬라이드를 한국어에 맞게 새로 만들거나(생성), 외국·기존 덱을 한글용으로 고치거나(변환), 규칙 대비 리뷰(검수)할 때 적극적으로 쓴다. "제안서 만들어줘 / 발표자료 / 피치덱 / 슬라이드 / PPT를 웹으로 / 투자 덱 / 세일즈 덱" 요청이면 곧바로 이 스킬을 켠다. 웹 반응형과 달리 투사 거리(뒷자리 가독성)를 우선해 본문 18pt·1920×1080 고정으로 짠다. 스크롤되는 웹앱/랜딩페이지/대시보드/마케팅 사이트는 이 스킬이 아니라 korean-web-layout으로 보낸다. 차트 단독 위젯 설계는 korean-dataviz가 맡는다. 한글 규칙(18pt·투사거리·왼쪽정렬 등) 준수가 목적이면 범용 슬라이드 스킬(frontend-slides)보다 이 스킬이 우선한다. 반대로 한글 규칙과 무관한 일반 HTML 슬라이드 생성이나 단순 파일 포맷 변환(PPT→PDF·이미지 추출)은 frontend-slides 또는 해당 변환 도구로 보낸다.
---

# Korean Proposal Slides — 한글 제안서/발표자료 제작·검수

한글 제안서를 **HTML 슬라이드**로 만들고 검수한다. 발표 상황(투사·화면공유·인쇄)에 맞춰
"뒷자리에서도 읽히는" 밀도를 강제하는 것이 핵심이다. `korean-proposal-designer` 에이전트가
주 사용자이며, 만들어진 덱은 `korean-design-checks`로 최종 검수될 수 있다.

**모든 수치의 근거는 foundation이다.** 지어내지 말고 아래를 근거로 삼는다:
- `../korean-design-foundation/SKILL.md` (6대 원칙·why)
- `../korean-design-foundation/references/design-type-matrix.md` → **제안서 행이 이 스킬의 1차 근거**
- `../korean-design-foundation/references/type-scale.md`, `spacing-grid.md`, `color-contrast.md`
- `../korean-design-foundation/references/component-slots.md` (ChartCard 6슬롯 등)
- `../korean-design-foundation/references/qa-checklist.md` (검수 모드)
- `../korean-design-foundation/references/tokens.dtcg.json` (토큰 최종 근거)

슬라이드별 상세 규칙·흔한 실패·검수 포인트는 → `references/slide-rules.md`.
실제 동작하는 템플릿은 → `assets/slide-template.html`.

## 언제 쓰고, 언제 안 쓰나

| 상황 | 이 스킬 | 대신 |
|---|---|---|
| 제안서/발표자료/피치덱/IR/세일즈 덱 제작 | ✅ | — |
| 외국·기존 PPT를 한글 웹 슬라이드로 변환 | ✅ | — |
| 완성된 덱을 한글 규칙으로 검수 | ✅ | — |
| 스크롤되는 웹앱·랜딩·마케팅 사이트 | ❌ | `korean-web-layout` |
| 대시보드(내부 데이터 화면) | ❌ | `korean-web-layout` / `korean-dataviz` |
| 차트 컴포넌트 단독 설계 | ❌ | `korean-dataviz` (슬라이드 안에 삽입할 땐 여기서 슬롯만) |
| 문서형(A4 리포트, 스크롤 읽기) | ❌ | `korean-web-layout` |

판단 기준: **"고정 화면(1920×1080)을 넘겨 가며 보고, 뒷자리에서도 읽혀야 하는가?"**
→ 예면 제안서, 아니면 웹.

## 왜 제안서는 웹과 다른가 (why)

foundation의 "왜 한글은 다른가"(네모꼴 음절 블록 → 줄 밀도가 빨리 참) 위에,
제안서는 **투사 거리**라는 제약이 하나 더 붙는다.

- **읽는 거리가 멀다.** 모니터는 40~60cm, 회의실 스크린은 3~10m. 그래서 웹 본문 17px을
  그대로 옮기면 뒷자리에서 안 읽힌다. 본문을 **18pt로 올리고, 라이브 발표는 24pt+**를 쓴다.
- **반응형이 아니라 고정이다.** 브레이크포인트로 재배치하지 않는다. **1920×1080 한 판**에
  맞춰 디자인하고, 화면 크기에 맞게 통째로 스케일만 한다(내용 재배치 없음).
- **한 슬라이드 = 한 메시지.** 스크롤이 없으니 넘치면 줄이는 게 아니라 **나눈다.**
  차트·표를 억지로 축소하면 뒷자리에서 죽는다 → 슬라이드를 분할한다.
- **여백이 곧 시선 유도.** 좌우 96px·상하 64px 세이프 마진을 지켜 프로젝터 오버스캔·
  가장자리 잘림을 피하고, 텍스트가 화면 끝에 붙지 않게 한다.

## 정본 수치 — 제안서 전용 (design-type-matrix 제안서 행)

foundation 타입 토큰의 **숫자를 그대로 재사용**하되, 단위는 발표용 **pt**이고 본문만 18pt로 올린다.
HTML 스테이지는 1920×1080 고정이라 **1pt = 2px**로 매핑된다(PowerPoint 16:9와 동일 환산).

| 역할 | 발표 크기(pt) | 1920 스테이지(px) | line-height | tracking | 근거 토큰 |
|---|---|---|---|---|---|
| caption(출처·각주) | 14pt | 28px | 1.45 | 0 | label(14) 근처, 최소한만 |
| **body(본문)** | **18pt** | 36px | 1.35~1.5 | 0 | 제안서 오버라이드 |
| body-live(라이브 본문) | **24pt+** | 48px+ | 1.4 | 0 | 투사 거리 우선 |
| h4/eyebrow | 18pt | 36px | 1.4 | 0 | body |
| h3/부제 | 24pt | 48px | 1.4 | 0 | title(24) |
| h2/슬라이드 제목 | 32pt | 64px | 1.4 | 0 | headline(32) |
| h1/표지 제목 | 44pt | 88px | 1.3 | 0 | display(44) |

- **줄간격:** 본문 1.35~1.5, 긴 설명 1.45~1.55. (웹 본문 1.6보다 조이는 이유: 슬라이드는
  행이 짧고 글자가 커서 1.6이면 문단이 흩어져 보인다. 대신 1.35 밑으로는 내리지 않는다.)
- **자간:** 본문·라벨·제목 기본 0. 비영 자간은 프로젝트 서체 기준과 렌더링 검수 근거가 있을 때만 제한적으로 쓴다.
- **레이아웃:** 1920×1080, 좌우 96px·상하 64px 세이프 마진, **12컬럼·거터 24px**.
- **정렬:** 본문·제목 모두 **왼쪽 정렬**. 양끝(justify) 금지, 중앙정렬은 표지/짧은 한 줄만.
- **색:** foundation color 토큰 그대로. text.primary `#111111` / secondary `#4B5563`,
  surface.default `#FFFFFF` / muted `#F7F8FA`. 회색 본문(text.tertiary #6B7280) 본문 사용 금지.
- **대비:** 큰 텍스트라도 배경 대비 최소 3:1, 본문 4.5:1(투사에서 대비 손실 크므로 여유 있게).

> 폰트 스택은 foundation과 동일: `"Pretendard Variable", Pretendard, -apple-system,
> BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif`.

## 세 가지 작업 모드

### 모드 A — 생성 (새 덱 제작)
1. **목적·청중·상황 확인.** 투자 IR / 세일즈 / 내부 보고 / 컨퍼런스 발표인지, **라이브 발표인지
   배포/인쇄인지** 먼저 묻는다. 라이브면 본문 24pt+, 배포면 18pt 기준.
2. **스토리라인 먼저, 디자인 나중.** 슬라이드 목록(표지→문제→해결→근거/데이터→실행→마무리)을
   한 줄 메시지로 뽑는다. 한 슬라이드 = 한 메시지.
3. **템플릿 복제.** `assets/slide-template.html`을 시작점으로 CSS 변수(토큰)는 건드리지 않고
   슬라이드만 채운다. 표지·본문·차트·마무리 4종이 이미 들어 있다.
4. **슬롯 채우기.** 차트는 ChartCard 6슬롯(title/subtitle/chart/description/source/download),
   표는 TableWrapper, 지표는 KpiCard로. 슬롯을 비우지 않는다(특히 source·description).
5. **넘치면 분할.** 한 판에 안 들어가면 폰트를 줄이지 말고 슬라이드를 나눈다(→ slide-rules).
6. **자체 검수(모드 C) 통과 후 인도.**

### 모드 B — 변환 (외국·기존 덱 → 한글)
1. **원본 진단.** 흔한 문제: 14~16pt 본문, 라틴용 과대 자간(+tracking), 중앙/양끝 정렬,
   불릿 남발, 슬라이드당 차트·표 과적. → slide-rules "흔한 실패" 대조.
2. **텍스트를 한글 밀도로.** 본문 18pt로 승격, tracking 0으로 리셋, 줄간격 1.35~1.5로,
   행 길이 한글 24~34자/혼합 45~65자로(BodyBlock max-width).
3. **정렬 교정.** 중앙/양끝 → 왼쪽 정렬. 불릿은 3~5개로 압축하고 나머지는 발표 노트로.
4. **레이아웃 재정렬.** 임의 여백을 4/8 스케일과 96/64 세이프 마진·12컬럼·거터24로 정돈.
5. **과적 슬라이드 분할.** 축소된 차트/표는 원 크기 복원 후 슬라이드 분할.
6. **색·토큰 매핑.** 원본 하드코딩 색을 foundation semantic 색으로 치환, 차트는 categorical 1~4.
7. **모드 C로 검수.**

### 모드 C — 검수 (규칙 대비 리뷰)
`../korean-design-foundation/references/qa-checklist.md` + `references/slide-rules.md`
"검수 포인트"로 항목별 **PASS / FAIL / N/A** 판정. FAIL은 근거 수치와 수정안을 붙인다.
핵심 체크(제안서 특화):

- 본문 **18pt 이상**(라이브면 24pt+)인가 / caption도 14pt 미만으로 내려가지 않았나
- 줄간격 1.35~1.5 범위인가(1.35 미만·1.6 초과 아님)
- 본문·라벨 자간 0인가, 제목의 비영 자간에는 검수 근거가 있나
- 정렬이 왼쪽인가(중앙·양끝 남용 아님)
- 세이프 마진 좌우96/상하64 지켰나, 텍스트가 가장자리에 붙지 않았나
- 한 슬라이드 = 한 메시지인가, 불릿 과다(6개+) 아님
- 차트·표를 **축소**하지 않고 필요 시 **분할**했나
- ChartCard 6슬롯(특히 source·description) 다 찼나 / 표 숫자 우정렬·셀 3줄 이내인가
- 색 대비 본문 4.5:1·큰 텍스트 3:1, 회색 본문 남용 아님
- 12컬럼·거터24·4/8 스케일 밖 임의 여백 없나

## 컴포넌트 슬롯 (foundation component-slots 준수)

슬라이드 안에서도 슬롯 규칙은 그대로다. 크기만 제안서 pt 스케일을 쓴다.

- **KpiCard** — `eyebrow / metric / delta / help`. metric은 h1(44pt) 대형 수치, tabular-nums.
- **ChartCard(6슬롯 필수)** — `title / subtitle / chart / description / source / download`.
  description·source·download **생략 불가**(배포/인쇄본에서 근거 추적을 위해). 발표용 화면에선
  download를 각주 형태로 작게 두어도 슬롯은 유지한다.
- **TableWrapper** — `title / description? / source? / download? / table`.
  숫자 우정렬·텍스트 좌정렬·셀 3줄 이내·세로 구분선 지양. 큰 표는 슬라이드 분할.
- **BodyBlock** — max-width 필수(한글 24~34자 / 혼합 45~65자). 슬라이드 폭이 넓어도
  본문 컬럼은 12그리드 중 7~9컬럼으로 묶어 행이 길어지지 않게 한다.

## frontend-slides 스킬과의 연동

일반(다국어·애니메이션 중심) HTML 프레젠테이션 제작은 전역 `frontend-slides` 스킬이 담당한다.
**둘을 함께 쓰는 법:** 구조·모션·빌드 골격은 `frontend-slides`로 잡고, **한글 타이포·간격·정렬·
색·검수 규칙은 이 스킬로 덮어씌운다.** 즉 이 스킬은 "한글 레이어"다. PPT→웹 변환도
`frontend-slides`의 변환 흐름을 쓰되, 최종 텍스트 밀도·정렬·토큰은 여기 기준으로 통과시킨다.

## 반환 (사람 메시지가 아니라 데이터)

작업 결과는 아래 형태의 데이터로 돌려준다(설명 문장 대신 구조화).

```json
{
  "mode": "create | convert | review",
  "files": ["/abs/path/deck.html"],
  "slides": [{ "index": 1, "type": "cover|body|chart|table|kpi|closing", "message": "..." }],
  "tokensUsed": ["fs-body(18pt)", "text.primary", "chart.categorical.1", "gutter-24"],
  "findings": [
    { "slide": 3, "rule": "본문 18pt", "status": "FAIL", "actual": "16pt", "fix": "36px로 상향" }
  ],
  "notes": "가정·비고"
}
```

- 생성·변환: `files`·`slides`·`tokensUsed` 채우고 `findings`는 자체검수 결과.
- 검수: `findings`를 항목별 PASS/FAIL/N/A로 채우는 것이 주 산출물.
