# 타이포그래피 상세

## 정본 타입 스케일

| 역할 | size | line-height | tracking | weight | 용도 |
|---|---|---|---|---|---|
| caption | 13px | 1.45 | 0em | 400 | 보조 설명, 각주, 메타 |
| label | 14px | 1.45 | 0em | 500 | UI 라벨, 태그, 버튼 텍스트 |
| body | **17px** | 1.6 | 0em | 400 | 기본 본문 (웹/랜딩) |
| body-dense | 15px | 1.5 | 0em | 400 | 표·밀도 높은 화면 본문 |
| title | 24px | 1.45 | 0em | 700 | 카드/섹션 제목 |
| headline | 32px | 1.4 | 0em | 700 | 페이지·섹션 헤드라인 |
| display | 44px | 1.3 | 0em | 700 | Hero, KPI 대형 수치 |

역할은 **Display / Heading / Title / Body / Label / Caption** 6종으로 고정. 실제 프로젝트에서는 6~8개 토큰 이내로 쓴다 — 미세하게 다른 여러 스타일은 한글에서 특히 나쁘다.

## heading:body 비율 (why)

heading과 body 차이는 **1.25~1.5배**가 자연스럽다. 한글은 줄 단위 덩어리가 빨리 차 보여, 크기·두께·간격 차이가 **한눈에 보이는 소수 체계**가 미세 차이의 다수 체계보다 낫다. 예: body 17px이면 title은 21~26px 범위에서 고른다(24px 권장).

## 유형별 본문 크기 조정

| 맥락 | 본문 | 근거 |
|---|---|---|
| 웹앱/랜딩 | 16~17px | KRDS 16px 하한, Pretendard는 17px 권장 |
| 대시보드 | 14~16px | 정보 밀도 |
| 표 | 15px(데스크톱)/14px(모바일) | 밀도, 스캔성 |
| 차트 라벨 | 14px / 13px(모바일) | 카드 내 축·라벨 |
| 제안서 | 18pt / 라이브 24pt+ | 투사 거리 |
| 모바일앱 | 16pt/sp | 터치·가독성 |

## 줄간격 (line-height) 실무 표준

- 본문: 1.55~1.6
- 긴 문장/문단: 1.6~1.7
- 라벨/캡션: 1.4~1.5
- 디스플레이급 제목: 1.3~1.45
- **본문 1.5 미만 금지** (표·카드에서 쌓임·피로 급증).

## 자간 (letter-spacing / tracking)

- 본문·라벨·네비·UI 텍스트: **0em**
- title / headline / display: 기본 **0em**
- 비영(非0) 자간은 프로젝트 서체 기준이나 렌더링 검수로 입증된 짧은 제목에서만 제한적으로 사용
- 전역 자간 조정 금지. 한글은 블록이 이미 분명해 과한 +tracking도, 습관적인 -tracking도 모두 쉽게 어색해진다.

## 폰트 로딩

Font stack:
```
"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif
```
- Pretendard Variable을 최우선 (크로스 플랫폼·다국어·시각 보정 강함).
- 웹: `@fontsource/pretendard` 또는 CDN(jsdelivr `pretendard`), `font-display: swap`.
- 공공 서비스 맥락은 Pretendard GOV 고려(같은 16px도 작게 보여 17px 사용).
- weight: regular 400 / medium 500 / bold 700 (3단계면 충분).

## 한·영·숫자 혼식

- 한국 서비스는 이메일·수치·영문명 혼합 빈도가 높다.
- 숫자는 표·KPI에서 **tabular-nums**(고정폭 숫자)로 정렬 안정화.
- 라벨 예외: 영문 약어·코드는 tracking 0 유지, 억지 자간 조정 금지.
