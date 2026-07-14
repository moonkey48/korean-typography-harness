# Fix Recipes

## Structure

- Replace centered full-viewport hero stacks with domain-specific macrostructure: workbench, ledger, editorial document, catalogue, studio bench, data notebook, or trust manual.
- Break 3 equal feature cards by promoting one primary workflow, grouping secondary details as rows, or replacing feature claims with process/evidence.
- Keep existing product intent unless the user confirms a redesign.

## Typography

- Use Korean role tokens: body, display, data, mono. Do not set font-family ad hoc in components.
- Solid ink beats gradient text. Display fonts stay out of form labels, table cells, chart labels, and long body copy.
- Use `word-break: keep-all`, stable line-height, and mobile text-fit checks.

## Color And Tokens

- Move raw colors into semantic tokens before changing component values.
- Limit accent to small decision points; avoid purple-blue/cyan-magenta gradients as the main personality.
- Verify contrast after every overlay, opacity, blend, and image treatment.

## Components And States

- Every touched interactive element needs default, hover, focus-visible, active, disabled, loading, and error/success where relevant.
- Do not express disabled state by lowering opacity on text containers if it breaks contrast.
- Prevent double submit for async actions.

## Copy And Proof

- Remove invented metrics, fake testimonials, placeholder names, and generic claims.
- Replace "다양한 기능을 통해 효과적으로..." with concrete nouns, actor, object, and outcome.
- CTA labels should say the outcome, not "Learn more", "Submit", or "Click here".

## Visuals And Decoration

- Remove fake browser/phone/IDE chrome unless it is a real product screenshot with provenance.
- Use a single icon library. No emoji as structural icons.
- If a visual is not semantic and does not survive the deletion test, cut it.

