/**
 * korean-design-checks — stylelint 설정
 *
 * 근거: korean-design-foundation (references/tokens.dtcg.json, references/qa-checklist.md).
 * 폰트 3속성 토큰 강제 + 단위/hex 제한에 집중한다.
 * (spacing shorthand 는 조합 폭발 때문에 stylelint 가 아니라 Tailwind/ESLint 층에서 강제 — lint-rules.md 4장.)
 *
 *   font-size      : 토큰 px 집합(13·14·15·17·24·32·44) 또는 var(--...) 만 허용
 *   line-height    : 토큰 수치(1·1.3·1.4·1.45·1.5·1.6·normal) 또는 var(--...) 만 허용
 *   letter-spacing : normal / 0 / 작은 검수 예외값 / var(--...) 만 허용. 본문·라벨은 0em 기준.
 *   unit           : 예상 단위만 허용(px rem em % vh vw fr deg s ms)
 *   color(hex)     : 직접 hex 경고 → 토큰(var(--color-...)) 유도
 *
 * 필요 패키지:  npm i -D stylelint
 * 사용:         stylelint "src/**\/*.{css,scss}" --config stylelint.config.cjs
 * 확장:         기존 설정이 있으면 extends 배열에 이 파일을 추가하거나 rules 를 머지.
 *
 * 주: 토큰이 var(--font-size-body) 형태로 이미 참조되면 아래 allowed-list 를 모두 통과한다.
 *    본 규칙은 "토큰 밖 raw 값"을 막기 위한 것이다.
 */

module.exports = {
  // 프로젝트가 stylelint-config-standard 를 쓰면 아래 주석 해제(npm i -D stylelint-config-standard):
  // extends: ['stylelint-config-standard'],
  rules: {
    // --- 폰트 3속성 토큰 강제 (whitelist) ---
    'declaration-property-value-allowed-list': {
      'font-size': [
        '/^(13|14|15|17|24|32|44)px$/',
        '/^var\\(--/',
        'inherit',
      ],
      'line-height': [
        '1',
        '1.3',
        '1.4',
        '1.45',
        '1.5',
        '1.6',
        'normal',
        'inherit',
        '/^var\\(--/',
      ],
      'letter-spacing': [
        'normal',
        '0',
        '0em',
        '0px',
        '0.5px',
        '1px',
        '-0.5px',
        '-1px',
        '0.01em',
        '-0.01em',
        '-0.015em',
        'inherit',
        '/^var\\(--/',
      ],
    },

    // --- 단위 제한: 예상 밖 단위(pt, cm 등) 차단 ---
    'unit-allowed-list': [
      'px',
      'rem',
      'em',
      '%',
      'vh',
      'vw',
      'fr',
      'deg',
      's',
      'ms',
    ],

    // --- raw hex 색상 경고 → 토큰 유도 ---
    'color-no-hex': [
      true,
      {
        severity: 'warning',
        message:
          'raw hex 금지(권장): 색은 토큰(var(--color-text-primary) 등)으로. 토큰 정의 파일은 overrides 로 예외.',
      },
    ],
  },

  overrides: [
    {
      // 토큰 정의/테마 파일은 hex 원본과 raw 값을 가져야 하므로 규칙을 끈다.
      files: [
        '**/tokens/**/*.{css,scss}',
        '**/*.tokens.{css,scss}',
        '**/theme.{css,scss}',
        '**/variables.{css,scss}',
      ],
      rules: {
        'color-no-hex': null,
        'declaration-property-value-allowed-list': null,
      },
    },
  ],
};
