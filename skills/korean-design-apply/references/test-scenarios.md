# 라우팅 테스트 시나리오

> `../SKILL.md`의 감지·라우팅·팀 동작이 기대대로 작동하는지 확인하는 회귀용 시나리오. 정상 흐름 1개 + 에러 흐름 1개를 단계별 기대 동작으로 기술한다. 근거 규칙은 `../../korean-design-foundation/`.

## 시나리오 1 — 정상 흐름: "한글 대시보드 만들어줘"

복합 유형 생성 작업의 표준 경로. 팀 구성·의존 사슬·점진 QA가 모두 발동한다.

### 입력
> "매출·가입자·전환율을 한눈에 보는 **한글 대시보드** 만들어줘. 추이 차트랑 지역별 표도 넣어줘."

### 기대 동작

1. **감지 (1단계)**
   - 유형: **대시보드** (+차트 +표 +KPI). 강한 단서 "대시보드", "추이 차트", "표".
   - 모드: **생성**. 대상물 없음, "만들어줘".
   - 모호하지 않으므로 되묻지 않는다.

2. **라우팅 (2단계)** → 복합이므로 `korean-design-lead`가 팀 구성. 팀 크기 **중(4~5)**.
   - 선행: `korean-token-engineer` / `korean-design-tokens`
   - 주: `korean-layout-designer` / `korean-web-layout`
   - 보조: `korean-dataviz-designer` / `korean-dataviz`
   - 마감: `korean-design-qa` / `korean-design-checks`

3. **팀 런타임 (3단계)**
   - **TeamCreate**: [token-engineer, layout-designer, dataviz-designer, qa].
   - **TaskCreate**(의존 사슬):
     - T1 토큰 세팅 → `_workspace/01_token-engineer_tailwind.preset.js`
     - T2 대시보드 레이아웃(inverted pyramid, 카드 간격 16~24px, no horizontal scroll, T1 의존) → `_workspace/02_layout-designer_dashboard.tsx`
     - T3 KpiCard(4슬롯)·추이 ChartCard(6슬롯: title/subtitle/chart/description/source/download)·지역별 TableWrapper(숫자 우정렬), T1·T2 의존 → `_workspace/03_dataviz-designer_cards.tsx`
     - T4 점진 QA(각 모듈 직후) → `_workspace/04_qa_report.md`
   - **SendMessage**: layout↔dataviz가 그리드 셀·카드 규격 합의, token-engineer가 토큰/유틸 이름 목록 공유(`text-title`·`p-16`·`bg-surface-muted` 등).

4. **점진 QA 발동** (핵심 검증 포인트)
   - T1 직후: DTCG ↔ Tailwind preset 대조, raw px/hex 부재 확인.
   - T2 직후: 본문 ≥16px, 간격 4/8 스케일, 중요 지표 상단, horizontal scroll 없음.
   - T3 직후: 차트 시리즈 ≤4·gridline ≤10·alt/source/download 유무, 표 숫자 우정렬·셀 3줄 이내·vertical line 지양, KPI tabular-nums.
   - FAIL 항목은 해당 전문가에게 1회 되돌려 재수정.

5. **종합·전달**
   - lead가 산출을 합쳐 **사용자 지정 경로**에만 최종본을 쓴다(`_workspace/`는 남기지 않음).
   - 출력: 유형·모드 판정 요약 → 위임 계획 → 통합 산출물 → QA PASS/FAIL 표.

### 통과 기준
- 팀이 4~5인으로 구성되고 dataviz가 정확히 포함된다(차트·표 존재).
- 토큰이 T1로 선행하고, 레이아웃·차트가 토큰 유틸만 참조한다.
- QA가 마지막 1회가 아니라 T1·T2·T3 직후 3회 이상 점진 실행된다.
- 최종본만 사용자 경로, 중간물은 `_workspace/`.

---

## 시나리오 2 — 에러 흐름: 유형 모호 + 도구 미설치

판별 폴백과 QA 도구 폴백이 모두 발동하는 경로.

### 입력
> "이 **웹페이지** 좀 더 좋게 만들어줘. 그리고 접근성 대비도 **검사**해줘."
> (대상 코드 경로가 함께 제시됨)

### 기대 동작

1. **감지 시 모호성 발생**
   - 유형: "웹페이지"만으로는 **웹앱 vs 랜딩** 확정 불가(약한 단서).
   - 모드: 대상 코드가 있으므로 **생성 아님** → 변환/검수 혼합. "좋게 만들어"=변환, "검사"=검수.
   - **폴백 규칙**: 대상물 유무로 모드는 좁혀지지만(변환+검수), 유형 축이 남는다 → 사용자에게 **1회만** 확인:
     > "이 화면이 방문자 설득형 **랜딩**인가요, 로그인 후 사용하는 **웹앱**인가요? (이 축만 정해지면 바로 진행합니다)"
   - 무한 되묻기 금지 — 확정 안 된 축(유형) 하나만 짧게 확인.

2. **확인 후 라우팅** (사용자가 "웹앱"이라고 답했다고 가정)
   - 변환 → `korean-layout-designer` / `korean-web-layout` (본문 16~17px, 회색 본문 남용 교정 등).
   - 검수 → `korean-design-qa` / `korean-design-checks` (대비 4.5:1 / 큰 텍스트 3:1 / 비텍스트 3:1).
   - 토큰 정합이 필요하면 `korean-token-engineer` 선행.

3. **도구 미설치 폴백**
   - `korean-design-qa`가 axe(또는 stylelint/Playwright)를 실행하려는데 **미설치**.
   - **에러 핸들링 규칙**: 설치 안내 또는 **수동 체크리스트로 폴백**하고 그 사실을 명시한다.
     > "axe 미설치 → `qa-checklist.md` 기준 수동 대비 점검으로 폴백. 자동 재검을 원하면 `npm i -D @axe-core/cli` 후 재실행 가능."
   - **검사 통과를 증명 없이 선언하지 않는다** — 수동 폴백이면 근거 수치(측정한 대비값 등)를 함께 제시하고, 자동 검증은 미수행임을 보고에 남긴다.

4. **전문가 실패 시(참고)**
   - 어떤 전문가가 2회(최초+재시도 1회) 실패하면 그 결과 없이 진행하고 최종 보고에 **누락 명시**("대비 자동 검증 미완 — 도구 미설치, 수동 결과만 첨부").

### 통과 기준
- 유형이 모호할 때 유형 축 하나만 **1회** 확인하고, 모드는 대상물로 자동 좁힌다.
- 도구 미설치 시 조용히 통과시키지 않고 수동 폴백 + 명시를 한다.
- 어떤 경우에도 증명 없는 "PASS" 선언이 없다.
