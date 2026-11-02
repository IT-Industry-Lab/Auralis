# TextArea

Import the component and its optional props type through the public API:

```tsx
import { TextArea, type TextAreaProps } from '@/shared/ui/TextArea';
```

Use TextArea within the application's browser-only client boundary. Its client directive does not
disable Next.js prerendering by itself. Shared styles must already be loaded as described in DESIGN.md.

## Props and value ownership

TextArea accepts native textarea attributes and events, including `value`, `defaultValue`, `onChange`,
`placeholder`, `name`, `required`, `disabled`, `readOnly`, and ARIA attributes. `children` is excluded.
The only additional props are optional strings: `label` and `error`. Validation belongs to the consumer.

Uncontrolled example with a native form reset:

```tsx
<form>
  <TextArea label="Description" name="description" defaultValue="Initial text" />
  <button type="reset">Reset</button>
</form>
```

Controlled example inside a client component:

```tsx
const [comment, setComment] = useState('');

<TextArea
  label="Comment"
  placeholder="Write a comment"
  value={comment}
  onChange={(event) => setComment(event.currentTarget.value)}
  error={commentError}
/>;
```

Import `useState` from React and supply `commentError` from your validation logic. Keep controlled and
uncontrolled ownership consistent throughout the field's lifetime.

## Accessibility

`label` is associated with the textarea using the supplied `id` or an automatically generated ID.
Without `label`, provide `aria-label`, `aria-labelledby`, or an external label associated with an
explicit `id`. A placeholder is a hint and does not replace an accessible name.

A nonempty `error` renders below the field, sets `aria-invalid="true"`, and adds its message ID to
`aria-describedby` while preserving external description IDs. Without an error, the supplied
`aria-invalid` is preserved. Explicit `aria-invalid="true"` also applies the error border.

Known contrast limitation: error text on the design's dark surfaces falls below the
[WCAG 2.2 AA minimum of 4.5:1 for normal text](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
This remains an unresolved design issue. The confirmed color is preserved pending an agreed design
correction; assess contrast against the actual surface surrounding the error message.

## States and layout

- Empty, unfocused fields use Default styling. Hover introduces no additional styling.
- Any nonempty value, including whitespace, uses Active styling when unfocused. Filled styling follows
  input, clearing, browser-applied `defaultValue` changes, controlled updates, and native form resets,
  including external forms mounted later. It does not depend on the placeholder or overwrite user input.
- Focus adds an external outline without moving text or changing layout dimensions.
- Errors keep their border on hover and focus; focus also retains its external outline.
- Disabled fields use native disabled behavior and muted field/label styling. Error messages and
  `aria-invalid` remain when supplied.
- Read-only fields remain focusable and selectable, following the normal value, error, and focus styles.

The component fills its container's available width. The field defaults to a border-box height of 84px
with 6px vertical and 12px horizontal padding. Label and error lines use a 24px line height with no extra
gap. Text wraps normally and overflow scrolls vertically. Resizing and autosize are disabled. Native
`rows` is passed through but does not override the CSS height.

## Styling and refs

`className`, `style`, and `ref` apply directly to the native textarea, not its wrapper. Use a parent
container to constrain the component's width. A CSS class or inline style can override field dimensions.

```tsx
const textareaRef = useRef<HTMLTextAreaElement>(null);

<TextArea label="Notes" ref={textareaRef} className={styles.notes} style={{ height: 120 }} />;
```

Import `useRef` from React. Object refs and callback refs, including React 19 cleanup functions, are
supported. Native event handlers are passed through unchanged.

Typography inherits the application's font family. Inter is not yet loaded, so text appearance and
wrapping cannot fully match the design until that foundation work is completed.
