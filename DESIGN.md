# Design foundations

The shared foundation contains the confirmed palette and typography parameters from the design
sections **UI Pallete**, **Typography**, and **Components**. It is not a complete application design
system. Existing components have not been migrated as part of this foundation.

## Files and naming

- [palette.css](src/shared/styles/palette.css) defines `--color-{scale}-{step}`. Scales are `accent`,
  `success`, `danger`, `warning`, `dark`, and `light`; steps are `100`, `300`, `500`, `700`, and `900`.
  Names follow visible design labels, not inconsistent internal layer names.
- [typography.css](src/shared/styles/typography.css) defines `--text-{recipe}-size`,
  `--text-{recipe}-weight`, and `--text-{recipe}-line-height`. Recipes are `large`, `h1`, `h2`, `h3`,
  `body-16`, `body-16-bold`, `body-14`, `body-14-medium`, `body-14-bold`, `small`, `small-semibold`,
  `link`, and `link-small`. All recipes use `--text-letter-spacing`; links also use
  `--text-link-decoration` and `--color-accent-500`.
- [globals.css](src/app/globals.css) imports both files once. The root layout already imports
  `globals.css`. Components consume the variables without importing the global files again.

## Use in CSS Modules

Keep component styles in colocated `*.module.css` files. Use shared variables instead of copying their
values into component-specific palettes:

```css
.title {
  font-size: var(--text-h1-size);
  font-weight: var(--text-h1-weight);
  line-height: var(--text-h1-line-height);
  letter-spacing: var(--text-letter-spacing);
}

.link {
  font-size: var(--text-link-size);
  font-weight: var(--text-link-weight);
  line-height: var(--text-link-line-height);
  letter-spacing: var(--text-letter-spacing);
  color: var(--color-accent-500);
  text-decoration: var(--text-link-decoration);
}
```

Recipe names describe appearance, not HTML tags. Choose heading levels from the document structure
and use links for navigation. Font family continues to inherit from the existing application styles.

Component owners can gradually replace matching local values with these tokens in their own tasks.
Review each replacement in context; a matching color alone does not establish its semantic role.
This foundation does not change component implementations, local variables, or exports.

## Extend and review

Before adding or changing a token, check the shared definitions and coordinate with component owners.
Confirm the value and its intended use against the relevant design section, then agree the name and
any design corrections with the team and designer. Do not guess missing states, invent palette steps,
or add duplicate shared definitions for individual components.

Update the CSS source of truth and this document when its usage contract changes. Review affected
consumers, formatting, CSS validation, production CSS imports, and browser-computed values. Semantic
tokens and additional themes need a confirmed use case and separate agreement.

## Limits and open questions

- The design uses Inter. Loading Inter and supplying font files are deferred. Current fonts remain
  unchanged, so glyph appearance, text widths, and wrapping cannot yet be verified against Inter.
- Dark and Light are palette scales, not implemented themes. Existing global colors, reset rules, and
  system color-scheme behavior remain unchanged; some existing colors are outside this palette.
- Secondary Active uses `#212121`, which is outside the confirmed palette. The team must resolve it;
  do not silently add it or substitute a nearby value.
- White Primary button text has approximately 3.86:1 default and 2.45:1 hover contrast, below the 4.5:1
  AA target for the specified text. Resolve this with the designer before adopting those combinations.
  This does not block transferring the confirmed palette.
- Combined component states, the meaning of Input Active, and responsive component behavior remain
  component-level questions. Icons and their delivery are deferred.
