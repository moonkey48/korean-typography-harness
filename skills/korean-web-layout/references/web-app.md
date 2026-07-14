# 웹앱 레이아웃 규칙 (한글)

> 관리자 콘솔·SaaS·내부 도구·서비스 웹앱의 레이아웃. 근거: `../../korean-design-foundation/references/design-type-matrix.md`(웹 앱 행), `spacing-grid.md`. 원칙만 알면 표에 없는 화면도 판단할 수 있다.

## 핵심 수치

| 항목 | 값 | 유틸 | 왜 |
|---|---|---|---|
| 본문 | 16~17px | `text-body`(17), 밀도 높은 목록만 `text-body-dense`(15) | 한글은 라틴 14~16을 옮기면 답답. 서비스 웹앱은 17 권장. |
| 보조 텍스트 | 14~15px | `text-label`(14) | 12px 보조텍스트는 대비·가독 미달의 주범. |
| 캡션 | 13px 이상 | `text-caption`(13) | 그 이하로 내리지 않는다. |
| page title | 24~32px | `text-headline`(32) / `text-title`(24) | 계층은 한눈에. |
| section 제목 | 19~24px | `text-title`(24) | body의 1.25~1.5배. |
| 줄간격 | 본문 1.5~1.6, label 1.4~1.5 | 토큰 lineHeight | 한글 줄 쌓임 방지. |
| 자간 | 본문·라벨·제목 기본 0em | 토큰 기본값 | 비영 자간은 서체 기준과 렌더링 검수 근거가 있을 때만 제한 사용. |

## 그리드 (KRDS)

화면 폭에 따라 컬럼 수를 바꾼다. 컨텐츠 컬럼은 아래 범위에서 고른다.

| 구간 | breakpoint | 컬럼 | 마진 | 거터 |
|---|---|---|---|---|
| small | sm 360 | **4–6** | 16px | ≥16(권장 24) |
| medium | md 768 / lg 1024 | **8–12** | 24px | 24 |
| large | xl 1280 / xxl 1440 | **12–16** | 24px | 24 |

- 한 화면에서 컬럼 수를 여러 개 섞지 않는다(웹앱 흔한 실패: "컬럼 혼용"). 한 그리드 체계로 통일하고 자식만 span을 다르게.
- 사이드바가 있으면 사이드바 폭을 뺀 본문 영역에 위 그리드를 적용한다.

## CTA·터치·인터랙션

- 버튼/입력/행 클릭영역 등 터치 목표는 **iOS 44pt / Android 48dp 이상**. 데스크톱이어도 이 하한을 지켜 마우스 정밀도 낮은 사용자를 배려한다. `min-h-[44px]`.
- CTA는 높이·패딩을 충분히: 세로 패딩 `py-12`~`py-16`, 가로 `px-16`~`px-24`. "CTA 높이 부족"이 흔한 실패.
- 상태(default/hover/focus/active/disabled) 대비를 초기에 검수. focus ring을 지우지 않는다.

## 회색 남용 금지 (한글 웹앱 최대 함정)

- 본문에 `text-tertiary`(#6B7280)를 쓰지 않는다 — 대비 4.5:1 미달 + 촌스러움. 본문은 `text-primary`, 보조는 `text-secondary`까지만.
- "차분하게" 보이려고 전체를 회색으로 깔면 정보 위계가 사라진다. 위계는 색 농도가 아니라 **크기·두께·간격**으로 만든다.
- disabled가 아닌 텍스트를 회색으로 죽이지 않는다.

## 흔한 실패 (design-type-matrix 웹앱 행)

12px 보조텍스트 · CTA 높이 부족 · 컬럼 혼용 · 지나친 회색 본문. 검수 시 이 4가지를 먼저 본다.

## 예시 — 리스트 + 상세 2단 웹앱 셸

```tsx
export function WebAppLayout() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <header className="sticky top-0 z-10 border-b border-surface-muted bg-surface">
        <div className="flex h-[56px] items-center justify-between px-16 md:px-24">
          <span className="text-title">관리자</span>
          <button className="min-h-[44px] rounded-md bg-surface-muted px-16 text-label">
            새 항목
          </button>
        </div>
      </header>

      {/* medium 이상에서 사이드 + 본문, small은 세로 스택 */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-24 px-16 py-24 md:flex-row md:px-24">
        {/* 목록: 밀도 높은 영역만 body-dense */}
        <aside className="w-full md:w-[320px] md:shrink-0">
          <ul className="flex flex-col gap-4">
            {['주문 12,340', '주문 12,341', '주문 12,342'].map((row) => (
              <li key={row}>
                <button className="min-h-[44px] w-full rounded-md px-16 text-left text-body-dense hover:bg-surface-muted">
                  {row}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* 상세: 본문 17, 긴 텍스트는 BodyBlock으로 max-width */}
        <main className="min-w-0 flex-1">
          <h1 className="text-headline">주문 12,340</h1>
          <p className="mt-16 text-body text-secondary max-w-[40rem]">
            주문 상세 설명은 한 행이 너무 길어지지 않도록 max-width로 제한합니다.
          </p>
        </main>
      </div>
    </div>
  );
}
```

- 컨테이너 `max-w-[1440px]`(xxl), 패딩 16→24가 breakpoint에 따라 커진다.
- 목록 항목·버튼은 `min-h-[44px]`로 터치 하한 준수.
- 상세 본문은 `max-w-[40rem]`(혼합 45~65자)로 행 길이 제한.
- 색은 `text-primary`/`text-secondary`만 사용, 회색 본문 없음.
