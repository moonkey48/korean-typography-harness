# Lint 룰 설계 — ESLint · stylelint

> 근거 수치는 모두 `../../korean-design-foundation/` (특히 `references/qa-checklist.md`, `references/tokens.dtcg.json`)에서 온다. 이 문서는 그 수치를 **정적 분석으로 집행하는 방법**을 설명한다. 실제 설정은 `../assets/.eslintrc.korean-design.cjs`, `../assets/stylelint.config.cjs`.

## 목차
1. 설계 원칙 (왜 정적 분석부터인가)
2. 집행할 규칙 목록 (토큰 → 룰 매핑)
3. ESLint: no-restricted-syntax 셀렉터 원리
4. stylelint: allowed/disallowed-list 원리
5. 도입법 (extends / merge)
6. 오탐(false positive) 처리
7. CI 게이트 배선

---

## 1. 설계 원칙 (왜 정적 분석부터인가)

정적 분석은 **가장 값싸고(수백 ms) 가장 결정적(deterministic)**이다. 렌더 테스트는 앱을 띄우고 뷰포트를 바꿔야 하지만, lint는 소스 텍스트만 읽는다. 그래서 점진 QA의 1단계다. 또한 정적 분석은 "이 화면 하나가 지금 괜찮은가"가 아니라 "이 소스가 앞으로도 규칙을 지키는가"를 본다 — 하드코딩 `13px`는 지금 화면이 우연히 괜찮아 보여도 다음 재사용에서 깨진다.

원칙 세 가지:
- **차단은 최소로.** foundation의 blocking 6종 중 정적으로 확실히 잡히는 것만 error로 둔다(본문<16, 과대 letter-spacing, 토큰 외 spacing). 애매한 것(raw hex, 제목 예외 자간 등)은 warning 또는 디자인 검수로 둔다. 과잉 차단은 팀이 `// eslint-disable`로 우회하게 만들어 규칙 자체를 무력화한다.
- **경계면 값을 본다.** 토큰이 정의됐는지가 아니라, 소스의 리터럴이 허용 토큰 집합 안에 있는지를 본다.
- **오탐보다 미탐을 감수.** lint가 다 잡지는 못한다(className 조합, 런타임 계산). 못 잡는 대비·리플로우는 4단계(axe/Playwright)가 맡는다. lint는 lint가 확실한 것만.

## 2. 집행할 규칙 목록 (토큰 → 룰 매핑)

| 규칙 | 근거(foundation) | 도구 | 심각도 |
|---|---|---|---|
| 본문 `font-size` ≥ 16px (dense 15 예외) | qa-checklist "본문 크기" | ESLint(인라인) + stylelint | error |
| `line-height` 본문 ≥ 1.5 | qa-checklist "줄간격" | stylelint | error(<1.5), warning(비토큰) |
| `letter-spacing` 오버튜닝 금지 | 6대 원칙 3, qa-checklist "자간" | ESLint + stylelint + 디자인 검수 | error/warning |
| spacing은 4·8·12·16·24·32·40·48·64만 | spacing-grid, qa-checklist "마진/거터" | ESLint(Tailwind arbitrary) + stylelint(단위) | error(arbitrary), warning(px 나열) |
| raw hex 직접 사용 최소화 | qa-checklist "코드 일관성", color-contrast | ESLint + stylelint | warning |
| `font-size`/`line-height`/`letter-spacing`는 토큰 값만 | tokens.dtcg.json | stylelint allowed-list | warning~error |

허용 토큰 상수(집행 기준):
- `font-size`: `13 14 15 17 24 32 44` px (또는 `var(--...)`). **16 미만은 본문 금지**이지만 13/14/15는 caption/label/dense 역할로만 허용된다. 정적 분석은 역할을 모르므로 stylelint는 "토큰 집합 밖"만 막고, "본문에 13px" 같은 역할 위반은 ESLint 인라인 규칙 + 렌더 리뷰가 보조한다.
- `line-height`: `1 1.3 1.4 1.45 1.5 1.6 normal` (+ `var(--...)`).
- `letter-spacing`: `normal 0 0em 0px 0.5px 1px -0.5px -1px 0.01em -0.01em -0.015em` (+ `var(--...)`). 본문/라벨은 0em 기준이며, 제목의 비영 자간은 검수 근거가 필요하다.
- spacing 유효 px: `4 8 12 16 24 32 40 48 64`.

## 3. ESLint: no-restricted-syntax 셀렉터 원리

`no-restricted-syntax`는 **코어 룰**이라 별도 플러그인이 필요 없다(파서만 TSX용으로 교체). esquery 셀렉터로 AST 노드를 지목하고 메시지를 붙인다.

- **인라인 스타일의 작은 fontSize** — `style={{ fontSize: '13px' }}`는 `ObjectExpression > Property[key.name='fontSize']`, 값은 `Literal`. 셀렉터: `Property[key.name="fontSize"][value.value=/^([0-9]|1[0-5])px$/]` → 0~15px 문자열만 매치, 16px+ 통과.
- **과대 letter-spacing** — `Property[key.name="letterSpacing"][value.value=/^(?:[+-]?(?:0?\.(?:0[2-9]|[1-9])\d*|[1-9]\d*)em|[+-]?(?:[2-9]|[1-9]\d+)px)$/]`. `0`·`0em`은 통과, `0.01em`·`-0.01em`·`1px`은 검수 가능한 작은 예외로 통과, `0.02em+`·`2px+`는 차단.
- **Tailwind arbitrary spacing** — `className="p-[13px]"`는 `JSXAttribute[name.name="className"]` 아래 `Literal`. 셀렉터: `JSXAttribute[name.name="className"] Literal[value=/\b[pm][trblxy]?-\[[0-9]/]` → `p-[..]`, `mx-[..]` 등 임의 spacing 값을 잡는다. 토큰 유틸(`p-4`)은 대괄호가 없어 통과.
- **raw hex(경고)** — `Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/]` → 어디에 쓰이든 hex 문자열이면 경고.

esquery 정규식은 `[attr=/regex/]` 형태로 넣는다. 문자열 리터럴의 실제 값은 `value.value`, 원문은 `value.raw`다(따옴표 포함). 여기서는 `value.value`(따옴표 제거된 값)를 쓴다.

한계: `className="text-[13px]"` 같은 arbitrary **폰트** 유틸이나 변수로 조립된 클래스(`` `p-${n}` ``)는 정적으로 못 잡는다. arbitrary 폰트는 위 spacing 셀렉터에 `t`(text) 접두를 추가하거나 별도 셀렉터를 둘 수 있으나, 오탐이 늘어 warning 권장. 변수 조립은 4단계 렌더가 잡는다.

## 4. stylelint: allowed/disallowed-list 원리

CSS/SCSS는 stylelint가 본다. 핵심 룰 두 개:

- `declaration-property-value-allowed-list` — 속성별 **허용 값 화이트리스트**. 값에 `/regex/` 문자열을 쓰면 정규식 매칭. `font-size`는 토큰 px 집합 + `var(--...)`만, `line-height`는 토큰 수치만, `letter-spacing`은 0과 작은 검수 예외값만 허용한다.
- 별도 positive blacklist는 두지 않는다. 한글 제목에 합법적인 작은 양수/음수 보정이 있을 수 있으므로, 문맥 판정은 디자인 리뷰와 렌더 QA가 맡는다.

보조 룰:
- `unit-allowed-list` — 프로젝트가 쓰는 단위만 허용(`px rem em % vh vw fr deg s ms`). 예상 밖 단위(`pt`,`cm`)를 차단.
- `color-no-hex` (또는 `color-named`) — hex 직접 사용을 경고로. 토큰 정의 파일은 `overrides`로 예외 처리(토큰 원본은 hex를 가져야 하므로).

allowed-list의 값 매칭은 **선언된 값 전체 문자열** 기준이다. `font-size: 13px` → `"13px"`가 리스트에 있거나 정규식에 걸려야 통과. shorthand(`margin: 4px 8px`)는 값 전체가 매칭돼야 하므로 spacing shorthand까지 화이트리스트로 강제하면 조합 폭발이 난다 — 그래서 **spacing 강제는 stylelint가 아니라 Tailwind/ESLint 층**에서 하고, stylelint는 폰트 3속성 + 단위·hex에 집중한다(설정 파일 주석에 명시).

## 5. 도입법 (extends / merge)

**신규 프로젝트(생성 모드):**
```bash
npm i -D eslint @typescript-eslint/parser stylelint
cp .claude/skills/korean-design-checks/assets/.eslintrc.korean-design.cjs ./
cp .claude/skills/korean-design-checks/assets/stylelint.config.cjs ./
```
`package.json` 스크립트:
```json
{
  "scripts": {
    "lint:kd": "eslint \"src/**/*.{ts,tsx,jsx}\" -c .eslintrc.korean-design.cjs",
    "lint:kd:css": "stylelint \"src/**/*.{css,scss}\" --config stylelint.config.cjs"
  }
}
```

**기존 설정이 있는 리포(변환 모드):** 기존 `.eslintrc`에 `extends: ['./.eslintrc.korean-design.cjs']`로 얹는다(뒤에 와서 우선). stylelint는 `extends`에 배열로 추가하거나 `rules`를 머지한다. 충돌(예: 기존 letter-spacing 규칙)은 삭제하지 말고 주석으로 출처를 병기하고 한글 기준을 우선한다.

## 6. 오탐(false positive) 처리

- **정당한 예외:** caption/label처럼 13·14px가 맞는 자리. ESLint 인라인 fontSize 규칙은 "본문"을 못 구분하므로, 이런 자리는 인라인 스타일이 아니라 토큰 유틸(`text-caption`)로 쓰면 애초에 규칙에 안 걸린다. **인라인 raw px 자체를 없애는 방향**이 정답이다.
- **불가피한 disable:** 서드파티 위젯 등은 파일/라인 단위 `// eslint-disable-next-line no-restricted-syntax -- 사유`로 열되, **사유를 반드시** 적는다. 사유 없는 disable은 리뷰에서 반려.
- **stylelint 토큰 정의 파일:** 토큰 원본(hex, raw px)은 `overrides`로 규칙을 끈다(설정에 포함).

## 7. CI 게이트 배선

점진 QA 순서대로 잡을 배치한다. 정적 잡이 실패하면 렌더 잡은 원인이 가려질 수 있으므로 `needs`로 의존시키거나(빠른 실패), 별도 리포트로 분리한다.

```yaml
# 예시 (GitHub Actions 개념)
jobs:
  lint:        # 단계 3, 가장 먼저
    run: npm run lint:kd && npm run lint:kd:css
  a11y:        # 단계 4
    needs: lint
    run: npx playwright test .claude/skills/korean-design-checks/assets/a11y.playwright.spec.ts
```

게이트 판정은 SKILL.md의 반환 스키마 `gates`로 집계한다. blocking error가 하나라도 있으면 해당 게이트 `fail`.
