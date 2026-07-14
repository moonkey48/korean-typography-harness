# 랜딩 페이지 레이아웃 규칙 (한글)

> 마케팅 랜딩·제품 소개·캠페인 페이지. 근거: `../../korean-design-foundation/references/design-type-matrix.md`(랜딩 행), `type-scale.md`, `spacing-grid.md`. 랜딩은 읽는 화면이므로 본문을 웹앱보다 한 단계 크게 잡는다.

## 핵심 수치

| 항목 | 값 | 유틸 | 왜 |
|---|---|---|---|
| 본문 | 데스크톱 17~18px, 모바일 16~17px | `text-body`(17) | 랜딩은 정독용. 웹앱보다 크게. |
| Hero 헤드라인 | 데스크톱 44~60px | `text-display`(44) | 짧은 대형 카피. 기본 자간은 0em. |
| Hero 헤드라인(모바일) | 32~40px | `text-display-sm`(36) | 390px 폭에서 44px는 13자 헤드라인도 줄바꿈이 위태롭다 — 파일럿 실측(2026-07-03, F1) |
| 섹션 제목 | 24~32px | `text-title`(24)/`text-headline`(32) | 섹션 위계. |
| Hero 줄간격 | 1.2~1.35 | 큰 제목은 좁게 | 대형 카피는 줄간격을 줄여 덩어리감. |
| 본문 줄간격 | 1.55~1.7 | body 1.6 | 긴 문장은 여유 있게. |
| 자간 | 본문·라벨·제목 기본 0em | 토큰 기본값 | 영문형 과대 tracking과 습관적 음수 tracking 모두 금지. |

## 그리드 (랜딩 전용)

| 구간 | breakpoint | 컬럼 | 마진 |
|---|---|---|---|
| 모바일 | sm 360 | **4** | 16px |
| 태블릿 | md 768 | **8** | 24px |
| 데스크톱 | lg 1024 / xl 1280 | **12** | 24px |

- 섹션 간격은 넉넉히: `py-48`~`py-64`(space.section). 랜딩은 섹션 리듬이 인상을 좌우한다.
- 콘텐츠 폭은 컨테이너 max-width로 잡고(예 1280), 그 안에서 12컬럼.
- **표기 규약**: 이 문서의 유틸 표기(`py-48` 등)는 **px 직표기**(px 단위 커스텀 스케일)다. 표준 Tailwind 스케일(1=4px) 프로젝트에서는 px÷4로 환산한다(`py-48`→`py-12`). 프로젝트가 어느 스케일인지 tokens 설정에서 먼저 확인할 것 (F4)

## 한글 랜딩 3대 주의 (흔한 실패)

design-type-matrix 랜딩 행의 실패 항목을 그대로 방어한다.

1. **영문형 과대 tracking.** 영문 랜딩을 흉내 낸 `letter-spacing: 0.1em` 류는 한글에서 성기고 촌스럽다. 본문·라벨·제목 기본값은 0이다.
2. **이미지 위 저대비 카피.** Hero 이미지 위 텍스트는 그라디언트/오버레이로 대비 4.5:1(큰 텍스트 3:1)을 확보한다. 밝은 배경에 흰 글씨 금지.
3. **과도한 center 정렬.** 모든 문단을 가운데 정렬하면 한글 긴 문장에서 시선 시작점이 흔들린다. Hero 한두 줄만 center, 본문 문단은 좌정렬 + max-width.

## 행 길이 (max-width)

- Hero 서브카피, 섹션 설명 등 문장형은 BodyBlock으로 감싼다: 한글 24~34자(32rem) / 혼합 45~65자(40rem).
- center 정렬 문단도 max-width로 폭을 묶어 행이 길어지지 않게 한다.

## 예시 — Hero + 특징 3열 섹션

```tsx
export function Landing() {
  return (
    <main className="bg-surface text-primary">
      {/* Hero: 이미지 위 카피는 오버레이로 대비 확보 */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-surface-muted" />
        {/* 이미지가 있다면: 위에 그라디언트 오버레이를 깔아 대비 3:1 이상 */}
        <div className="mx-auto max-w-[1280px] px-16 py-64 text-center md:px-24">
          <p className="text-label text-secondary">새로워진 워크플로우</p>
          <h1 className="mx-auto mt-16 max-w-[20ch] text-display">
            팀의 속도를 바꾸는 한 줄
          </h1>
          {/* 서브카피: center여도 max-width로 행 길이 제한 */}
          <p className="mx-auto mt-24 max-w-[32rem] text-body text-secondary">
            영문 템플릿을 그대로 옮기지 않고, 한글에 맞는 크기와 줄간격으로 다시 짰습니다.
          </p>
          <div className="mt-32 flex justify-center gap-12">
            <a className="min-h-[44px] inline-flex items-center rounded-md bg-primary-cta px-24 text-label text-white" href="#">
              시작하기
            </a>
          </div>
        </div>
      </section>

      {/* 특징: 모바일 1열 → md 2열 → lg 3열 */}
      <section className="mx-auto max-w-[1280px] px-16 py-48 md:px-24 md:py-64">
        <div className="grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-3">
          {['빠른 시작', '팀 협업', '자동 리포트'].map((t) => (
            <article key={t} className="rounded-lg bg-surface-muted p-24">
              <h2 className="text-title">{t}</h2>
              {/* 본문 문단은 좌정렬 */}
              <p className="mt-12 text-body text-secondary">
                기능 설명은 좌정렬로, 한 행이 길어지지 않게 카드 폭 안에서 흐릅니다.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- Hero 헤드라인도 `text-display` 기본 자간 0em을 쓴다. 비영 자간은 렌더링 검수 근거가 있을 때만 예외로 둔다.
- 서브카피는 center여도 `max-w-[32rem]`으로 행 길이 제한.
- 특징 카드 본문은 좌정렬, 섹션 간격 `py-48`~`py-64`.
- CTA는 `min-h-[44px]`. (`bg-primary-cta`는 korean-design-tokens가 정의하는 브랜드 색 토큰 자리 — 색값은 tokens 소관.)
- 신뢰 요소(로고 월·사례·인증마크)·B2B CTA 선택·리드폼·요금제 표기·섹션 순서 관례는 `landing-trust-conversion.md` 참조.
