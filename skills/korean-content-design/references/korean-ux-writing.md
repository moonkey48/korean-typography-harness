# Korean UX Writing

Use this reference for Korean buttons, labels, forms, onboarding, empty states, errors, confirmations, tables, toasts, and localization cleanup.

## Voice

- Prefer natural, direct Korean over translation tone.
- Keep politeness consistent within a surface: `합니다` for formal product surfaces, `해요` for warmer consumer surfaces. Do not mix casually.
- Use action-focused labels. Avoid explaining the UI with long helper copy when a better label or hierarchy would solve it.
- Remove vague words like "진행", "처리", "수행" when a concrete verb is available.

## Buttons And Commands

- Use short command labels: `저장`, `삭제`, `복사`, `공유`, `내보내기`, `다시 시도`.
- Prefer the object only when the action is obvious: `초대장 보내기`, `결제 취소`, `API 키 만들기`.
- Destructive actions should be explicit, not softened: `삭제`, `취소`, `연결 해제`.
- Avoid awkward nominalization: prefer `저장` over `저장하기` unless the product style consistently uses verb-noun labels.

## Forms

- Labels should name the field, not instruct the user: `이메일`, `프로젝트 이름`, `결제 수단`.
- Placeholder text should show examples only when examples help. Do not hide requirements only in placeholders.
- Helper text should clarify constraints: `영문, 숫자, 하이픈만 사용할 수 있어요.`
- Validation should be specific: `이메일 형식이 올바르지 않아요.` is better than `잘못된 입력입니다.`

## Errors

Use this structure:

1. What happened.
2. Why, if known.
3. What the user can do next.

Good:

- `파일을 업로드하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.`
- `결제를 완료하지 못했습니다. 카드 한도를 확인하거나 다른 결제 수단을 선택해 주세요.`

Avoid:

- Blame: `잘못 입력하셨습니다.`
- Dead ends: `오류가 발생했습니다.`
- Engineering leakage: raw exception text unless the user is a developer and needs it.

## Empty And Loading States

- Empty states should name the state and offer the next action.
  - `아직 생성한 프로젝트가 없습니다. 새 프로젝트를 만들어 시작하세요.`
- Loading text should set expectation without fake precision.
  - `이미지를 생성하고 있어요. 보통 1분 안에 완료됩니다.`
- Avoid filler such as `잠시만 기다려주세요` when the UI can show progress or a retry path.

## Variables And Particles

Korean particles can break when variables have unknown final consonants. Avoid patterns like:

```text
{{name}}을 삭제할까요?
```

Prefer wording that removes the particle problem:

```text
선택한 항목을 삭제할까요?
프로젝트 "{{name}}" 삭제
삭제할 프로젝트: {{name}}
```

For counts, choose copy that works for zero, one, and many:

- `선택한 항목 {{count}}개`
- `댓글이 없습니다`
- `댓글 {{count}}개`

## Review Checklist

- Is the Korean natural if read aloud?
- Are honorifics and sentence endings consistent?
- Does each button say what will happen?
- Does each error tell the user what to do next?
- Do variables avoid particle bugs?
- Are English terms intentional and consistent?
- Can the same copy survive mobile width, loading, empty, and error states?
