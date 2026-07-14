/**
 * korean-design-checks — 렌더 후 접근성/레이아웃 회귀 테스트
 *
 * 근거: korean-design-foundation
 *   - 대비: references/color-contrast.md (일반 4.5:1 / 큰 3:1 / 비텍스트 3:1)
 *   - 확대: references/design-type-matrix.md 5장 (200% 무손실, 대시보드 400%)
 *   - 터치: iOS 44pt / Android 48dp
 *   - breakpoint: sm 360
 *
 * 필요 패키지:
 *   npm i -D @playwright/test @axe-core/playwright
 *   npx playwright install --with-deps chromium
 *
 * 실행(앱을 먼저 띄운 뒤 — 포트 충돌은 lsof -i :3000 으로 확인):
 *   QA_BASE_URL=http://localhost:3000 \
 *     npx playwright test .claude/skills/korean-design-checks/assets/a11y.playwright.spec.ts
 *
 * 라우트(ROUTES)는 프로젝트에 맞게 수정한다. 없는 라우트는 test.skip 처리하거나 지운다.
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3000';

const ROUTES = {
  dashboard: '/dashboard',
  form: '/form',
  table: '/table',
} as const;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'];

// --- 헬퍼: axe 로 WCAG 위반 수집 ---
async function analyze(page: Page) {
  return new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
}

// --- 헬퍼: 대비 위반 0 (blocking) + 전체 위반 0 ---
async function expectNoA11yViolations(page: Page) {
  const results = await analyze(page);
  const contrast = results.violations.filter((v) => v.id === 'color-contrast');
  // 대비는 foundation blocking 1순위 → 위반 노드를 메시지에 실어 즉시 위치 파악.
  expect(contrast, JSON.stringify(contrast, null, 2)).toEqual([]);
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
  }));
  expect(results.violations, JSON.stringify(summary, null, 2)).toEqual([]);
}

// --- 헬퍼: 페이지 전체 가로 스크롤 없음(리플로우 = 확대 무손실) ---
async function expectNoHorizontalScroll(page: Page, label: string) {
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth - d.clientWidth;
  });
  // 1px 반올림 오차만 허용.
  expect(overflow, `${label}: 가로 스크롤 ${overflow}px (리플로우 실패)`).toBeLessThanOrEqual(1);
}

// --- 헬퍼: 상호작용 요소 터치 목표 >= 44 ---
async function expectTouchTargets(page: Page) {
  const controls = page.locator(
    'button, a[href], [role="button"], input[type="checkbox"], input[type="radio"]',
  );
  const n = await controls.count();
  for (let i = 0; i < n; i++) {
    const el = controls.nth(i);
    if (!(await el.isVisible())) continue;
    const box = await el.boundingBox();
    if (!box) continue;
    const min = Math.min(box.width, box.height);
    const html = (await el.evaluate((e) => e.outerHTML)).slice(0, 80);
    // WCAG 2.5.5 예외(inline 링크)는 오탐 가능 → 필요 시 로케이터를 nav/actions 로 좁힐 것.
    expect(min, `터치 목표 미달(${Math.round(min)}px): ${html}`).toBeGreaterThanOrEqual(44);
  }
}

// =====================================================================
// 시나리오 1 — 대시보드: 대비 0 + 리플로우(200%·400%)
// =====================================================================
test.describe('대시보드', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}${ROUTES.dashboard}`);
    await page.waitForLoadState('networkidle');
  });

  test('WCAG 대비/역할 위반 0', async ({ page }) => {
    await expectNoA11yViolations(page);
  });

  test('데스크톱에서 가로 스크롤 없음', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await expectNoHorizontalScroll(page, '대시보드 1280');
  });

  test('200% 확대(640px 등가) 무손실', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 });
    await expectNoHorizontalScroll(page, '대시보드 200%');
  });

  test('400% 확대(320px 등가) 무손실 — 대시보드/웹 필수', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await expectNoHorizontalScroll(page, '대시보드 400%');
  });
});

// =====================================================================
// 시나리오 2 — 폼: 라벨/ARIA 위반 0
// =====================================================================
test.describe('폼', () => {
  test('WCAG(label/aria) 위반 0', async ({ page }) => {
    await page.goto(`${BASE}${ROUTES.form}`);
    await page.waitForLoadState('networkidle');
    const results = await analyze(page);
    const naming = results.violations.filter((v) =>
      ['label', 'label-title-only', 'form-field-multiple-labels', 'aria-input-field-name'].includes(v.id),
    );
    expect(naming, JSON.stringify(naming, null, 2)).toEqual([]);
    await expectNoA11yViolations(page);
  });
});

// =====================================================================
// 시나리오 3 — 표: 페이지 가로 스크롤 금지(표 자체 컨테이너 스크롤은 허용)
// =====================================================================
test.describe('표', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}${ROUTES.table}`);
    await page.waitForLoadState('networkidle');
  });

  test('WCAG 위반 0', async ({ page }) => {
    await expectNoA11yViolations(page);
  });

  test('페이지(body)는 가로 스크롤 없음', async ({ page }) => {
    // 표는 자체 컨테이너 내부 스크롤 허용. 여기서는 문서 전체(documentElement)만 판정.
    await expectNoHorizontalScroll(page, '표 페이지');
  });
});

// =====================================================================
// 시나리오 4 — 모바일(sm 360): 대비 + 터치 목표
// =====================================================================
test.describe('모바일 뷰(sm 360)', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test('대시보드 모바일: 대비 0 + 가로 스크롤 없음', async ({ page }) => {
    await page.goto(`${BASE}${ROUTES.dashboard}`);
    await page.waitForLoadState('networkidle');
    await expectNoA11yViolations(page);
    await expectNoHorizontalScroll(page, '모바일 대시보드');
  });

  test('폼 모바일: 터치 목표 >= 44', async ({ page }) => {
    await page.goto(`${BASE}${ROUTES.form}`);
    await page.waitForLoadState('networkidle');
    await expectTouchTargets(page);
  });
});
