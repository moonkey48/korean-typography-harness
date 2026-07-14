# Font And Layout Checklist

Use this reference before calling Korean UI work complete, especially after editing CSS or React/Vue/Svelte components.

## Implementation Defaults

Start from the project design system. If there is no Korean typography rule, add the smallest scoped rule needed:

```css
:root {
  --font-ko: Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
}

[lang="ko"],
.ko-copy {
  font-family: var(--font-ko);
  line-height: 1.55;
}

.ko-label,
.ko-heading,
.ko-button {
  word-break: keep-all;
  overflow-wrap: break-word;
}

.numeric {
  font-variant-numeric: tabular-nums;
}
```

Do not add a global reset that unexpectedly changes non-Korean surfaces. Scope the rule to the component, page, locale wrapper, or `lang="ko"` when possible.

## Stress Strings

Use these strings to test layout:

- `프로젝트 설정을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.`
- `선택한 항목 128개를 영구적으로 삭제할까요? 이 작업은 되돌릴 수 없습니다.`
- `API 키가 만료되었습니다. 새 키를 만든 뒤 환경 변수에 다시 등록하세요.`
- `콘텐츠 생성 요청이 대기열에 추가되었습니다. 완료되면 알림을 보내드릴게요.`
- `example-user-with-very-long-email-address@example-company-domain.com`

## Component QA

- Buttons: longest Korean label fits at mobile width, loading state does not resize the button, destructive action is visually distinct.
- Tabs/nav: labels do not wrap awkwardly or force horizontal overflow unless that pattern is intentional.
- Cards/lists: Korean text does not become one word per line on mobile.
- Tables: Korean headers remain scannable; numeric columns align; long names truncate intentionally with tooltip or detail view.
- Forms: label, helper, validation, placeholder, and error copy all fit together.
- Modals: title is specific; body explains irreversible actions; primary/secondary buttons are unambiguous.
- Toasts: text is short enough to read before dismissal and does not hide the next action.

## Accessibility And Reading Quality

- Check contrast for Korean text at actual weight and size, not just token values.
- Keep clickable targets large enough on mobile; Korean labels may need wider controls.
- Avoid using color alone for destructive or error states.
- Ensure headings and labels remain meaningful to screen readers.
- Set `lang="ko"` for Korean documents or localized regions when the app supports mixed languages.

## Final Verification

Before final response, report at least one of:

- desktop and mobile screenshots checked
- rendered DOM/CSS inspected
- component storybook or preview checked
- static copy review completed with stress strings
- verification blocked, with the exact blocker
