/**
 * korean-design-checks — ESLint 공유 설정 (eslintrc 형식)
 *
 * 근거: korean-design-foundation (references/qa-checklist.md, references/tokens.dtcg.json).
 * 정적으로 확실한 blocking 위반만 error 로 집행한다(과잉 차단은 팀이 disable 로 우회 → 규칙 무력화).
 *
 *   [error]  본문 font-size 16px 미만        — 인라인 스타일 리터럴 style={{ fontSize:'13px' }}
 *   [error]  과대 letter-spacing             — 한글 본문/라벨은 0em, 제목 예외는 검수 필요
 *   [error]  Tailwind arbitrary spacing      — p-[..] / mx-[..] / gap-[..] 등 토큰 밖 값
 *
 * raw hex 색상 경고는 stylelint(color-no-hex)가 CSS 에서 담당한다(stylelint.config.cjs).
 * 인라인 hex 를 여기서도 잡고 싶으면 아래 HEX 블록 주석을 해제해 no-restricted-syntax 에 추가.
 *
 * 필요 패키지:  npm i -D eslint @typescript-eslint/parser
 * 사용:         eslint "src/**\/*.{ts,tsx,jsx}" -c .eslintrc.korean-design.cjs
 * 확장:         기존 .eslintrc 의 extends 에 "./.eslintrc.korean-design.cjs" 추가(뒤에 와서 우선).
 *
 * 한계(정적 미탐 — 4단계 axe/Playwright 가 보조):
 *   - 변수로 조립된 className(`p-${n}`)·상속으로 계산된 실제 대비는 못 잡는다.
 *   - caption/label(13·14px)은 인라인 raw px 대신 text-caption 등 토큰 유틸로 쓰면 애초에 안 걸린다.
 */

const NON_TOKEN_SPACING_MSG =
  '토큰 외 spacing 금지: arbitrary 값(p-[..], mx-[..], gap-[..]) 대신 토큰 유틸(p-4·p-8·p-12·p-16·p-24·p-32·p-40·p-48·p-64)을 사용하세요.';

const restricted = [
  {
    // 인라인 스타일의 본문 미만 크기: '0px'~'15px' 문자열만 매치, 16px+ 통과.
    selector: "Property[key.name='fontSize'][value.value=/^([0-9]|1[0-5])px$/]",
    message:
      '본문 16px 미만 금지: 하드코딩 대신 타입 토큰(text-body 17px / text-body-dense 15px)을 사용하세요. 13·14px 은 caption/label 전용 역할 토큰으로만.',
  },
  {
    // 과대 letter-spacing 차단: 본문/라벨은 0em, 제목의 비영 자간은 검수된 작은 값만 허용.
    selector:
      "Property[key.name='letterSpacing'][value.value=/^(?:[+-]?(?:0?\\.(?:0[2-9]|[1-9])\\d*|[1-9]\\d*)em|[+-]?(?:[2-9]|[1-9]\\d+)px)$/]",
    message:
      '자간 오버튜닝 금지: 한글 본문/라벨은 0em, 제목/디스플레이의 비영 자간은 프로젝트 서체 기준과 렌더링 검수로 입증된 경우에만 제한적으로 사용하세요.',
  },
  {
    // Tailwind arbitrary spacing: p-[13px], mx-[10px] 등. 토큰 유틸(p-4)은 대괄호가 없어 통과.
    selector:
      "JSXAttribute[name.name='className'] Literal[value=/\\b[pm][trblxy]?-\\[[0-9]/]",
    message: NON_TOKEN_SPACING_MSG,
  },
  {
    // Tailwind arbitrary gap: gap-[..] / gap-x-[..].
    selector:
      "JSXAttribute[name.name='className'] Literal[value=/\\bgap(-[xy])?-\\[[0-9]/]",
    message: NON_TOKEN_SPACING_MSG,
  },
  // --- HEX(선택): 인라인 raw hex 도 error 로 잡으려면 아래 주석 해제 ---
  // {
  //   selector: "Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/]",
  //   message: 'raw hex 사용: 토큰(text-primary·bg-surface 또는 var(--color-...))으로 대체하세요.',
  // },
];

module.exports = {
  // 공유 설정: root 는 소비 측에서 결정한다. 여기서는 파서/규칙만 제공.
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2022: true,
  },
  rules: {
    'no-restricted-syntax': ['error', ...restricted],
  },
  overrides: [
    {
      // 토큰 정의 파일은 raw px/hex 원본을 가져야 하므로 규칙을 끈다.
      files: [
        '**/tokens/**',
        '**/*.tokens.{ts,js}',
        '**/design-tokens.{ts,js}',
      ],
      rules: { 'no-restricted-syntax': 'off' },
    },
  ],
};
