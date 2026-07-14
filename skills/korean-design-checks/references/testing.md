# 렌더 후 테스트 — Storybook a11y · Playwright + axe · 확대

> 근거 수치는 `../../korean-design-foundation/`에서 온다: 대비(color-contrast), 터치·확대(design-type-matrix 5장), 행 길이·표·차트 규칙, qa-checklist. 이 문서는 그 수치를 **렌더된 결과에서 집행하는 방법**이다. 실제 테스트는 `../assets/a11y.playwright.spec.ts`.

## 목차
1. 렌더 검수가 필요한 이유 (정적으로 못 잡는 것)
2. Storybook addon-a11y (컴포넌트 단위 조기 발견)
3. Playwright + @axe-core/playwright (페이지 단위)
4. 시나리오: 대시보드 / 폼 / 표 / 모바일
5. 200% · 400% 확대(리플로우) 테스트
6. 터치 목표 크기 측정
7. 오탐·게이트 처리

---

## 1. 렌더 검수가 필요한 이유

정적 분석(단계 3)은 소스 텍스트만 본다. 다음은 **오직 렌더 후에만** 드러난다:
- **상속·오버라이드 대비:** 소스는 `text-primary`(#111)인데 부모 배경이 바뀌어 실제 대비가 3:1로 떨어짐.
- **이미지 위 카피:** hero 오버레이가 약해 실제 대비 미달.
- **리플로우 손실:** 200% 확대 시 가로 스크롤이 생기거나 요소가 잘림.
- **터치 크기:** 패딩·라인하이트 조합의 결과로 버튼 실측이 44px 미만.
- **동적 콘텐츠:** 긴 한글 문장이 들어와 행 길이/셀 3줄 규칙을 실측으로 넘김.

그래서 4단계는 **렌더된 계산값 ↔ foundation 기준**을 교차 비교한다. axe는 대비/역할을, Playwright는 레이아웃(리플로우·터치·뷰포트)을 맡는다.

## 2. Storybook addon-a11y (컴포넌트 단위 조기 발견)

페이지를 조립하기 전에, 컴포넌트 스토리에서 먼저 대비·역할·라벨을 본다. 격리돼 있어 원인 지목이 쉽다.

설치·설정:
```bash
npm i -D @storybook/addon-a11y @storybook/test-runner axe-playwright
```
```js
// .storybook/main.js  → addons 에 추가
addons: ['@storybook/addon-a11y']
```
개발 중엔 Storybook UI의 **Accessibility 패널**로 위반을 즉시 본다. CI에서는 `@storybook/test-runner`가 각 스토리를 렌더하고 `axe-playwright`로 검사하게 한다:
```js
// .storybook/test-runner.js
const { injectAxe, checkA11y } = require('axe-playwright');
module.exports = {
  async preVisit(page) { await injectAxe(page); },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      axeOptions: { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    });
  },
};
```
KpiCard/ChartCard/TableWrapper 같은 슬롯 컴포넌트는 **긴 한글 텍스트 스토리**(24~34자 초과 케이스)를 따로 만들어 행 길이·줄바꿈 붕괴를 조기에 본다.

## 3. Playwright + @axe-core/playwright (페이지 단위)

실제 라우트를 띄워 axe를 주입한다. `AxeBuilder`로 태그를 WCAG로 좁히고, 대비(`color-contrast`)는 별도 assertion으로 강조한다.

```bash
npm i -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium
```
핵심 패턴(전체는 `../assets/a11y.playwright.spec.ts`):
```ts
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  .analyze();
const contrast = results.violations.filter(v => v.id === 'color-contrast');
expect(contrast, JSON.stringify(contrast, null, 2)).toEqual([]);
```
`color-contrast`를 따로 뽑는 이유: foundation의 blocking 1순위가 대비다. 실패 시 메시지에 위반 노드를 그대로 실어 어디를 고칠지 즉시 보이게 한다.

앱을 먼저 띄운다. 포트 충돌을 피하려면 실행 전 `lsof -i :3000` 등으로 확인한다. `QA_BASE_URL`로 대상 주소를 주입한다.

## 4. 시나리오: 대시보드 / 폼 / 표 / 모바일

각 유형은 서로 다른 실패 모드를 가진다(design-type-matrix "흔한 실패"). 시나리오도 그에 맞춘다.

- **대시보드** — KPI/차트 과적재, 내부 스크롤, 회색 본문. 검사: axe 대비 0, 가로 스크롤 없음, 400%까지 리플로우.
- **폼** — 라벨 누락, 낮은 대비 help/error. 검사: axe `label`·`aria` 위반 0, 모든 input이 접근가능한 이름 보유(`getByLabel` 존재), 상태색 단독 전달 금지(아이콘/텍스트 병기 — 렌더 스냅샷 보조).
- **표** — 숫자 좌정렬, 셀 넘침, 페이지 가로 스크롤. 검사: 표는 **자체 컨테이너 내부** 스크롤은 허용하되 **페이지(body)** 가로 스크롤은 금지, 헤더 고정 확인.
- **모바일(sm 360)** — 12px 회색 텍스트, 터치 44/48 미만, fontScale 무시. 검사: `page.setViewportSize({width:360})` 후 axe + 터치 크기 측정(6장).

## 5. 200% · 400% 확대(리플로우) 테스트

WCAG 1.4.10 Reflow는 "1280px 폭 기준 400% 확대"를 **320 CSS px 폭에서 가로 스크롤 없이 사용 가능**으로 규정한다. 즉 확대는 **뷰포트 폭 축소로 등가 검증**한다:

| 확대율 | 등가 뷰포트 폭(1280 기준) | 적용 대상 |
|---|---|---|
| 200% | 640px | 모든 화면 |
| 400% | 320px | 대시보드·웹 콘텐츠 |

검사 방법(콘텐츠·기능 손실 없음 = 세로 스크롤만 허용, 가로 스크롤 금지):
```ts
async function expectNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth - d.clientWidth;
  });
  // 1px 반올림 오차만 허용
  expect(overflow, `가로 스크롤 ${overflow}px 발생(리플로우 실패)`).toBeLessThanOrEqual(1);
}
```
`page.setViewportSize({ width: 640, height: 900 })` → 검사, `{ width: 320 }` → 검사. 뷰포트 축소는 실제 브라우저 확대와 레이아웃 반응이 사실상 동일하며(미디어쿼리·반응형이 그대로 작동), CSS `zoom`보다 크로스 브라우저로 안정적이다. 표의 지정된 스크롤 컨테이너는 예외로 두되, `document.documentElement`(페이지 전체) 기준으로만 실패 판정한다.

## 6. 터치 목표 크기 측정

렌더된 상호작용 요소의 실측 박스가 iOS 44 / Android 48 이상인지 본다.
```ts
const controls = page.locator('button, a[href], [role="button"], input[type="checkbox"], input[type="radio"]');
const n = await controls.count();
for (let i = 0; i < n; i++) {
  const el = controls.nth(i);
  if (!(await el.isVisible())) continue;
  const box = await el.boundingBox();
  if (!box) continue;
  expect(Math.min(box.width, box.height),
    `터치 목표 미달: ${await el.evaluate(e => e.outerHTML.slice(0,60))}`).toBeGreaterThanOrEqual(44);
}
```
주의: 본문 속 인라인 텍스트 링크는 44px 규칙의 예외가 될 수 있다(WCAG 2.5.5 예외 "inline"). 오탐이 잦으면 로케이터를 액션/네비 영역(`nav`, `[data-testid=actions]`)으로 좁히거나, 44 미만을 **warning**으로 리포트하고 리뷰에서 판정한다 — 게이트를 인라인 링크로 막지 않는다.

## 7. 오탐·게이트 처리

- **axe incomplete:** axe는 확실치 않은 항목을 `incomplete`로 낸다. 이는 FAIL이 아니라 N/A + 수동 확인으로 리포트.
- **동적 데이터 의존(차트 시리즈·셀 줄수):** 렌더 스냅샷으로 보조하되 데이터가 바뀌면 결과가 흔들린다. 애매하면 N/A로 남기고 컴포넌트 QA/리뷰 템플릿으로 넘긴다.
- **게이트 집계:** axe blocking(대비) 실패 → `gates.axe=fail`. 리플로우/터치 실패 → `gates.playwright=fail`. Storybook 미구성 → `gates.storybook_a11y=na`. SKILL.md 반환 스키마로 집계한다.
