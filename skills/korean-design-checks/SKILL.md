---
name: korean-design-checks
description: 한글 디자인 코드·화면을 검수하고 회귀 테스트할 때 사용한다. 본문 16px 미만, 토큰 외 spacing/색, WCAG 대비 미달, 차트 4시리즈 초과·표 정렬 위반 같은 규칙 위반을 ESLint·stylelint·axe·Playwright로 자동 차단하고, foundation의 마스터 검수 체크리스트(qa-checklist)를 4단계 파이프라인으로 실행한다. PR 리뷰·CI 게이트·디자인 리뷰·"이 화면 규칙에 맞는지 확인"·"확대해도 안 깨지나"·"대비 통과하나" 요청에서 트리거한다. 단순히 "본문 몇 px가 정답이냐" 같은 규칙 조회만 필요하면 이 스킬이 아니라 korean-design-foundation을 본다.
---

# Korean Design Checks — 한글 디자인 검수·회귀 파이프라인

이 스킬은 **판정 도구**다. 새 규칙을 만들지 않고, `korean-design-foundation`의 수치를 **집행**한다. 모든 통과/실패 기준의 근거는 `../korean-design-foundation/SKILL.md`와 그 `references/`(특히 `references/qa-checklist.md`)에 있다. 수치가 헷갈리면 지어내지 말고 foundation에서 다시 확인한다.

주 사용자는 `korean-design-qa` 에이전트다. 이 스킬은 검수 대상(코드 경로·URL·Figma·PR diff)을 받아 **데이터로 된 검수 리포트**를 돌려준다. 사람에게 보내는 산문이 아니라 게이트 판정 데이터를 반환한다(맨 아래 반환 스키마).

## 두 가지 핵심 태도 (why)

### 1. 존재 확인이 아니라 "경계면 교차 비교"

검수의 흔한 실패는 "토큰이 있으니 통과"로 끝내는 것이다. 토큰이 정의돼 있어도, 화면에는 하드코딩 `13px`가 그대로 남아 있을 수 있다. 그래서 이 스킬은 **경계면(seam)마다 양쪽 값을 맞대어 비교**한다.

- 디자인 ↔ 핸드오프: Figma 스타일 값 ↔ 토큰 정의가 같은가.
- 핸드오프 ↔ 코드: 토큰 이름 ↔ 실제 클래스/변수 사용이 같은가.
- 코드 ↔ 렌더: 소스의 의도한 크기·대비 ↔ 브라우저에 실제로 계산된 값이 같은가.
- 렌더 ↔ 규칙: 렌더된 대비/터치/행길이 ↔ foundation 기준이 같은가.

"토큰 파일에 body=17px가 존재한다"는 통과 근거가 아니다. **그 값이 이 컴포넌트의 이 경계면을 실제로 통과했는가**가 근거다. 리포트의 각 finding은 `expected`와 `actual`을 항상 함께 적는다.

### 2. 점진 QA — 싸고 빠른 검사부터, fail-fast

느린 렌더 테스트를 먼저 돌리면 피드백이 늦다. 값싼 정적 분석부터 실행하고, 앞 단계가 막히면 뒤 단계는 굳이 돌리지 않는다(막힌 근본 원인이 뒤 단계 실패를 가릴 수 있으므로).

```
1 정적(ms)   →  2 컴포넌트(초)  →  3 통합/렌더(수십 초)  →  4 접근성 확대(분)
ESLint/          Storybook          Playwright             axe 대비 +
stylelint        addon-a11y         E2E 시나리오           200%/400% 확대
```

CI에서도 이 순서로 잡(job)을 배치하고, 앞 잡 실패 시 뒤 잡을 건너뛰거나 계속하되 결과는 단계별로 분리해 보고한다.

## 세 작업 모드

검수 스킬도 foundation 계약대로 세 모드를 지원한다. 모드는 "무엇을 대상으로 판정하느냐"의 차이다.

- **검수(review) — 기본 모드.** 이미 있는 코드/화면/PR을 규칙 대비 판정한다. 대상: 파일 경로, URL, PR diff, Figma. 출력: PASS/FAIL/N/A findings + 게이트 판정.
- **생성(setup).** 아직 파이프라인이 없는 프로젝트에 검수 인프라를 깐다. `assets/`의 설정을 프로젝트에 복사하고(아래 "도입"), CI 잡과 npm 스크립트를 만든다. 출력: 생성한 파일 목록 + 남은 수동 설정.
- **변환(migrate).** 외국·레거시 설정을 한글 기준으로 바꾼다. 예: `eslint-config-airbnb`만 있는 리포에 `.eslintrc.korean-design.cjs`를 `extends`로 얹고, 기존 stylelint에 본 규칙을 머지한다. 충돌 규칙은 삭제하지 말고 병기 후 한글 기준을 우선한다. 출력: diff + 충돌 목록.

## 검수 4단계 파이프라인

각 단계는 서로 다른 경계면을 본다. 단계마다 "무엇을", "어떤 도구로", "무엇과 교차 비교하는지"가 정해져 있다.

### 단계 1 — 디자인 검수 (design)
- **본다:** Figma/시안의 타입·간격·색이 토큰과 일치하는가.
- **도구:** Figma 스타일 audit(수동 또는 `mcp__claude_ai_Figma__get_variable_defs`), 타이포 토큰 diff.
- **교차 비교:** 시안 값 ↔ `tokens.dtcg.json`. 시안이 15.5px·1.3 줄간격처럼 토큰 밖 값을 쓰면 코드로 내려가기 전에 여기서 FAIL.
- **주 항목:** 본문 크기·줄간격·자간·제목 대비 비율(1.25~1.5배)·행 길이 max-width 유무·ChartCard 6슬롯/TableWrapper 슬롯 충족.

### 단계 2 — 핸드오프 검수 (handoff)
- **본다:** 시안→코드 계약이 토큰 이름으로 표현됐는가(raw 값이 아니라).
- **도구:** 토큰 이름 대조, `korean-design-tokens` 산출물과의 매핑 확인.
- **교차 비교:** 디자인 스펙의 역할(body/title…) ↔ 코드가 쓸 유틸 이름(`text-body`, `text-title` …). 이름이 없으면 "16개 크기가 흩어진" 미세 차이 다수 체계로 흐른다.

### 단계 3 — 코드 생성 검수 (code, 정적)
- **본다:** 소스 자체가 규칙을 어기는가. **가장 값싸고 가장 먼저** 돌린다.
- **도구:** ESLint(`assets/.eslintrc.korean-design.cjs`) + stylelint(`assets/stylelint.config.cjs`).
- **교차 비교:** 소스의 리터럴 값 ↔ 허용 토큰 집합. 하드코딩 `fontSize:'13px'`, 과대 `letter-spacing`, `p-[13px]` 같은 토큰 외 spacing, raw hex를 잡는다.
- **자동 차단(blocking):** 본문 16px 미만, 토큰 외 spacing, 과대 letter-spacing. raw hex는 경고.

### 단계 4 — 렌더 후 검수 (render, 동적)
- **본다:** 브라우저에 실제로 계산된 결과가 규칙을 지키는가. 소스가 맞아도 상속·오버라이드·이미지 위 텍스트 때문에 렌더가 어긋날 수 있다.
- **도구:** Storybook `addon-a11y`(컴포넌트 단위), Playwright + `@axe-core/playwright`(`assets/a11y.playwright.spec.ts`).
- **교차 비교:** 렌더된 대비/역할/터치 크기/행길이 ↔ foundation 기준. **200% 확대 무손실**, 대시보드·웹은 **400%(=320px 리플로우)**까지.
- **자동 차단(blocking):** WCAG 대비 미달(일반 4.5:1·큰 텍스트 3:1·비텍스트 3:1), 200% 확대 시 콘텐츠/기능 손실, 터치 목표 미달(iOS 44·Android 48).

## 도구별 역할 (한 줄 요약)

| 도구 | 단계 | 경계면 | 잡는 것 |
|---|---|---|---|
| **ESLint** | 3 코드 | 소스↔토큰 | JSX/TSX 인라인 스타일·className의 본문<16, 과대 letter-spacing, 토큰 외 spacing, raw hex |
| **stylelint** | 3 코드 | CSS↔토큰 | `font-size`/`line-height`/`letter-spacing` 토큰 강제, 단위·hex 제한 |
| **Storybook addon-a11y** | 4 렌더 | 컴포넌트↔WCAG | 격리된 컴포넌트의 대비·역할·라벨 위반 (조기 발견) |
| **@axe-core/playwright** | 4 렌더 | 페이지↔WCAG | 실제 페이지의 대비·ARIA 역할·이름 위반 |
| **Playwright** | 4 렌더 | 렌더↔레이아웃 규칙 | 200%/400% 리플로우, 뷰포트별(모바일/데스크톱) 깨짐, 터치 크기 |

axe와 stylelint/ESLint는 **겹치지 않는다.** 정적 분석은 소스의 의도를, axe는 계산된 결과를 본다. 둘 다 필요하다 — 소스가 맞아도 상속 때문에 대비가 깨질 수 있고, 대비가 맞아도 소스에 하드코딩이 남아 다음 화면에서 깨진다.

## 실행법 (검수 모드)

프로젝트에 도입돼 있으면 아래를 순서대로 돌린다. 앞 단계 blocking 실패가 있으면 원인부터 고친다.

```bash
# 단계 3 — 정적 (가장 먼저)
npx eslint "src/**/*.{ts,tsx,jsx}" -c .claude/skills/korean-design-checks/assets/.eslintrc.korean-design.cjs
npx stylelint "src/**/*.{css,scss}" --config .claude/skills/korean-design-checks/assets/stylelint.config.cjs

# 단계 4 — 렌더 (앱을 먼저 띄운 뒤: 포트 사용 여부 lsof -i :3000 확인)
QA_BASE_URL=http://localhost:3000 \
  npx playwright test .claude/skills/korean-design-checks/assets/a11y.playwright.spec.ts

# 단계 4 — 컴포넌트 (Storybook)
npm run storybook   # addon-a11y 패널로 확인, CI는 @storybook/test-runner + axe
```

Figma/시안(단계 1)과 핸드오프(단계 2)는 자동화가 부분적이라 리뷰 템플릿으로 판정한다: `assets/DESIGN_REVIEW_TEMPLATE.md`. PR 게이트 요약은 `assets/PR_TEMPLATE.md`.

## qa-checklist 실행법 (마스터 체크리스트 매핑)

`../korean-design-foundation/references/qa-checklist.md`의 11개 항목을 이 파이프라인에 1:1로 매핑한다. 각 항목은 **PASS / FAIL / N/A**로 판정하고, FAIL은 근거 수치(expected vs actual)와 수정 제안을 붙인다.

| qa-checklist 항목 | 통과 기준(요약) | 판정 단계·도구 |
|---|---|---|
| 본문 크기 | ≥16px, dense table만 15px | 3 ESLint/stylelint |
| 줄간격 | 본문 ≥1.5, 긴 문단 1.6 내외 | 3 stylelint / 1 디자인 |
| 자간 | 한글 본문·라벨 0em, 제목도 기본 0em, 비영 자간은 검수 근거 필요 | 3 ESLint/stylelint + 1 디자인 |
| 제목 대비(비율) | 제목:본문 1.25~1.5배 | 1 타입 토큰 diff |
| 마진/거터 | 토큰 값만, small 16·medium+ 24 | 3 ESLint(spacing)/stylelint |
| 색 대비 | 일반 4.5:1·큰 3:1·비텍스트 3:1 | 4 axe |
| 확대 대응 | 200% 무손실, 대시보드 400% | 4 Playwright |
| 터치 목표 | iOS 44pt·Android 48dp | 4 Playwright(box) |
| 차트 시리즈 | ≤4, stacked 4범주, gridline ≤10 | 1 리뷰 + 컴포넌트 QA |
| 표 규칙 | 숫자 우정렬·텍스트 좌정렬·3줄·vertical line 지양 | 1 리뷰 + 4 렌더 |
| 코드 일관성 | raw px/hex 최소화, 토큰 참조 강제 | 3 ESLint/stylelint |

차트 시리즈·표 규칙은 정적 분석만으로는 완전 판정이 어렵다(데이터 의존). 컴포넌트 QA와 렌더 스냅샷을 병행하고, 애매하면 FAIL이 아니라 N/A + 수동 확인 요청으로 남긴다 — 오탐으로 게이트를 막지 않는다.

### P0-7 확장 — 사용성 항목 매핑

qa-checklist의 **사용성 섹션(P0-7, 8항목)**을 같은 방식으로 매핑한다. 자동화 불가 항목은 기존 원칙대로 FAIL이 아니라 **N/A + 수동 확인 요청**으로 남긴다 — 오탐 방지 원칙은 그대로다.

| qa-checklist 사용성 항목 | 통과 기준(요약) | 판정 단계·도구 |
|---|---|---|
| async 액션 피드백 | 모든 async 액션에 로딩·성공·실패 피드백 | 4 Playwright |
| 인라인 검증 타이밍 | blur+submit 타이밍(입력 중 실시간 에러 지양) | 4 Playwright |
| 에러 카피·입력 보존 | 원인+해결 카피, 실패 시 입력 보존 | 4 Playwright(보존) + 5 카피(수동) |
| focus-to-first-error | 첫 에러 필드 포커스 + `aria-describedby` 연결 | 4 Playwright + axe |
| 파괴적 액션 확인/undo | 확인 단계 또는 undo 존재 | 4 Playwright |
| 목록·표 3상태 | 로딩·빈·에러 3상태 구현 | 3 정적 + 4 Playwright(모킹), 모킹 불가 시 N/A+수동 |
| 모달·멀티스텝 탈출 경로 | ESC/닫기/뒤로가기 존재, 막다른 길 금지 | 4 Playwright |
| 내비 현재 위치 | 현재 위치 표시 | 수동(N/A+수동) — 경고 유지 |

사용성 판정의 정본은 `../korean-design-foundation/references/usability-heuristics.md`(P0-1)다. 수치·근거가 헷갈리면 그 문서에서 다시 확인한다.

> 변경: 2026-07-03 P0-7 수정

## 자동 차단(blocking) 규칙 요약

CI를 **빨간불로 막는** 위반은 다음뿐이다. 나머지는 경고로 리포트해 리뷰에서 다룬다(과잉 차단은 팀이 규칙을 우회하게 만든다).

1. 본문 텍스트 16px 미만(예외: dense table 15px). — 단계 3
2. 토큰 외 spacing(4·8·12·16·24·32·40·48·64 밖). — 단계 3
3. 과대 `letter-spacing` 또는 본문/라벨 non-zero tracking. — 단계 3 + 단계 1
4. WCAG 대비 미달(일반 4.5:1 / 큰 3:1 / 비텍스트 3:1). — 단계 4
5. 200% 확대 시 콘텐츠·기능 손실(리플로우 실패). — 단계 4
6. 터치 목표 44/48 미만. — 단계 4

raw hex, 행길이 max-width 누락, ChartCard 슬롯 누락은 **경고**로 두고 리뷰 템플릿에서 판정한다.

### P0-7 승격 차단 항목 (7~12)

P0-7로 아래가 경고에서 **차단으로 승격**됐다. 단, 자동 판정이 확실할 때만 차단한다 — 검사 불가·데이터 의존·모킹 불가로 애매하면 기존 원칙대로 N/A+수동으로 남기고 게이트를 막지 않는다(오탐 방지 원칙 유지). 카피 적절성·IA 명료성·내비 현재 위치 표시는 **경고(수동 판정) 유지**.

7. `word-break: keep-all` 미적용 — 제목·버튼·라벨 대상. — 단계 3(stylelint) + 단계 4(computed style)
8. 하드코딩 날짜/숫자 포맷 — `korean-number-date-units.md` 위반. — 단계 3(grep/ESLint)
9. 파괴적 액션 확인/undo 부재. — 단계 4(Playwright)
10. 인라인 에러 필드 미연결(`aria-describedby`/`aria-invalid`) 또는 focus-to-first-error 부재. — 단계 4(Playwright + axe)
11. async 이중 제출 미방지(pending 중 재클릭 시 중복 요청 발생). — 단계 4(Playwright)
12. 멀티스텝 뒤로가기 부재(막다른 길). — 단계 4(Playwright)

## P0-7 확장 검사 — keep-all · 날짜/숫자 포맷 · 한글 카피

### word-break: keep-all (제목·버튼·라벨)

- **대상:** `h1`~`h6`, `button`/`[role="button"]`, `label`·`th`·`legend` 등 줄바꿈 시 어절이 끊기면 안 되는 짧은 한글 텍스트.
- **정적(단계 3, stylelint):** 전역/컴포넌트 CSS에 해당 셀렉터의 `word-break: keep-all` 선언이 있는지 확인 — PASS 후보까지만.
- **렌더(단계 4, Playwright computed style) — 최종 판정:** 상속·오버라이드 때문에 정적 통과가 렌더 통과를 보장하지 않는다. 경계면 교차 비교 원칙 그대로, 브라우저에 계산된 값을 본다.

```ts
for (const sel of ['h1,h2,h3,h4,h5,h6', 'button,[role="button"]', 'label,th,legend']) {
  for (const el of await page.locator(sel).all()) {
    expect(await el.evaluate(e => getComputedStyle(e).wordBreak)).toBe('keep-all');
  }
}
```

### 하드코딩 날짜/숫자 포맷

규칙 정본: `../korean-design-foundation/references/korean-number-date-units.md`(P0-4). 위반 grep 패턴 예시:

```bash
# ISO/서양식 날짜 리터럴이 UI 문자열에 하드코딩 (표면 표기는 YYYY.MM.DD 또는 YYYY년 M월 D일)
grep -rnE '>[^<]*[0-9]{4}-[0-9]{2}-[0-9]{2}' src/ --include='*.tsx' --include='*.jsx'
grep -rnE '[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}' src/
# 로케일 미지정 포매터 (ko-KR 명시 강제)
grep -rnE 'toLocale(Date|Time)?String\(\s*\)' src/
grep -rnE 'Intl\.(DateTimeFormat|NumberFormat)\(\s*\)' src/
# 만/억 그루핑 없이 7자리 이상 원화 노출 (예: 1,250,000원 → "125만 원")
grep -rnE '[0-9]{1,3}(,[0-9]{3}){2,}\s*원' src/
```

히트는 FAIL 후보다. 상수 정의·테스트 픽스처·API 직렬화 값은 오탐일 수 있으니 location을 확인해 **UI 노출 문자열만** FAIL로 판정한다. `korean-number-date-units.md`가 아직 없는 프로젝트면 N/A+수동.

### 단계 5 — 한글 카피 검수 (copy, 신설)

단계 4 뒤에 실행한다. 렌더/소스에서 추출한 한글 카피(에러 메시지·빈 상태·버튼 라벨·안내문)를 플러그인 스킬로 판정한다.

- **`korean-skills:humanizer`** — AI 생성 티 감지(40패턴, S1/S2/S3 심각도): 번역투(에 대해/통해/되어진다)·쉼표 과다·AI 어휘 과용 등.
- **`korean-skills:style-guide`** — 어조 일관성·날짜 표기 등 스타일 규칙 대조.

배선: Skill 도구로 `korean-skills:humanizer` → `korean-skills:style-guide`를 순서대로 호출하고, 추출한 카피 텍스트를 args로 넘긴다. 결과는 findings에 `stage: "copy"`, `tool: "humanizer" | "style-guide"`, severity **warning**(비차단)으로 기록한다 — 카피 판정의 최종 책임은 수동 리뷰이며 이 단계는 판정 보조다. 애매하면 N/A+수동.

> 변경: 2026-07-03 P0-7 수정

## 반환 데이터 스키마

검수 모드는 아래 JSON을 반환한다(산문 금지). `korean-design-qa`가 이 데이터를 그대로 집계·게시한다.

```json
{
  "skill": "korean-design-checks",
  "mode": "review",
  "target": "src/ + http://localhost:3000",
  "summary": { "pass": 0, "fail": 0, "na": 0, "blocking": 0 },
  "gates": {
    "eslint": "pass|fail|skipped",
    "stylelint": "pass|fail|skipped",
    "axe": "pass|fail|skipped",
    "storybook_a11y": "pass|fail|skipped|na",
    "playwright": "pass|fail|skipped",
    "copy": "pass|fail|skipped|na"
  },
  "findings": [
    {
      "id": "body-min-size",
      "check": "본문 최소 크기",
      "status": "FAIL",
      "severity": "blocking|warning|info",
      "stage": "design|handoff|code|render|copy",
      "tool": "eslint|stylelint|axe|playwright|storybook|review|humanizer|style-guide",
      "expected": "≥16px (dense table만 15px)",
      "actual": "13px",
      "location": "src/components/Notice.tsx:42",
      "fix": "text-body(17px) 또는 text-body-dense(15px) 토큰 사용"
    }
  ]
}
```

- `status`는 항목별 PASS/FAIL/N/A. `gates`는 도구별 종합(하나라도 blocking FAIL이면 그 게이트 fail).
- `expected`/`actual`을 반드시 채운다 — "경계면 교차 비교"의 증거다.
- 상충하는 데이터는 삭제하지 않고 `notes` finding으로 병기하고 유형 매트릭스를 기준으로 택한다.

생성 모드는 `{ "skill": "...", "mode": "setup", "created": [파일...], "manual": [남은 설정...] }`, 변환 모드는 `{ "mode": "migrate", "diff": [...], "conflicts": [...] }`로 반환한다.

## 자산(assets/) 안내

프로젝트 도입 시 아래를 복사·확장한다. 모두 실제 동작하는 설정이다(플레이스홀더 아님).

- `assets/.eslintrc.korean-design.cjs` — 본문<16·과대 letter-spacing·토큰 외 spacing 차단, raw hex 경고. `@typescript-eslint/parser` 필요.
- `assets/stylelint.config.cjs` — `font-size`/`line-height`/`letter-spacing` 토큰 강제, 단위·hex 제한.
- `assets/a11y.playwright.spec.ts` — 대시보드/폼/표/모바일 시나리오 + 200%·400% 리플로우 + 터치 크기.
- `assets/PR_TEMPLATE.md` / `assets/DESIGN_REVIEW_TEMPLATE.md` — qa-checklist 기반 체크 항목.

## references/ — 상세 조회 (필요할 때만)

- `references/lint-rules.md` — ESLint/stylelint 커스텀 룰 설계 근거, 셀렉터 원리, 도입·확장·오탐 처리.
- `references/testing.md` — Storybook addon-a11y, Playwright+axe 시나리오, 200%/400% 확대 테스트 방법론.

의심스러우면 foundation을 다시 본다. 이 스킬은 규칙을 **집행**할 뿐, 규칙의 출처는 언제나 `../korean-design-foundation/`이다.
