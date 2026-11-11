# SelectBox

A controlled single-selection field built with `@radix-ui/react-select@2.4.1`.
Import from `@/shared/ui/SelectBox` and use inside the application's browser-only boundary.
Shared styles must already be loaded as described in DESIGN.md.

## API

- `value: string` and `onValueChange: (value: string) => void` are required. The consumer owns
  the value; `""` means no selection. There is no `defaultValue` or uncontrolled mode.
- `options: readonly SelectBoxOption[]` contains unique, stable, non-empty string `value`,
  non-empty plain-text `label`, optional decorative `icon: ReactNode`, and optional `disabled`.
- Optional `placeholder` and visible `label`. Without a visible label, provide a non-empty
  `aria-label` or `aria-labelledby` referencing existing text. Placeholder is not a label.
- Optional `disabled`, `name`, `required`, and `form` are passed to Radix. They do not register
  the field with a form library or implement application validation.
- `aria-describedby` and `aria-invalid` connect external descriptions and validation state.
  There is no error prop or visual error state. Omitted `id` is generated automatically.
- `className`, `style`, `id`, `ref: Ref<HTMLButtonElement>`, `onFocus`, and `onBlur` target
  the trigger button. Refs are passed directly to Radix; `.focus()` targets the trigger.

Icons appear beside the label in both the list and selected value. Supply decorative content
only, never interactive elements or components creating portals. Icon subtrees are inert
and hidden from accessibility APIs. For images use `next/image` with dimensions and `alt=""`.
Plain-text labels remain in the DOM for accessibility and typeahead, including when truncated.

## With useState

```tsx
import { useState } from 'react';
import { SelectBox } from '@/shared/ui/SelectBox';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
];

export function LanguageField() {
  const [language, setLanguage] = useState('en');

  return (
    <SelectBox
      aria-label="Interface language"
      options={languageOptions}
      value={language}
      onValueChange={setLanguage}
    />
  );
}
```

Locale changes, persistence, loading options, and dependent selections belong to consumers.
For country/city fields the parent clears the city when the country changes.

## With React Hook Form

Use `Controller` in the consumer. Set initial values in `useForm`, map `field.onChange` to
`onValueChange`, and pass `field.onBlur`, `field.name`, and `field.ref` to the trigger API.
Do not additionally register the same field. SelectBox has no React Hook Form dependency.

```tsx
import { Controller, useForm } from 'react-hook-form';
import { SelectBox } from '@/shared/ui/SelectBox';

const countryOptions = [
  { value: 'by', label: 'Belarus' },
  { value: 'ru', label: 'Russia' },
];

export function ProfileForm() {
  const { control, handleSubmit, reset } = useForm<{ country: string }>({
    defaultValues: { country: 'by' },
  });

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState }) => (
          <SelectBox
            label="Country"
            options={countryOptions}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            disabled={field.disabled}
            aria-invalid={fieldState.invalid}
          />
        )}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={() => reset()}>
        Reset
      </button>
    </form>
  );
}
```

Validation rules, error messages, and submission belong to the form. `onBlur` is the trigger's
event: opening the portalled list can mark the field touched as focus enters the list. It
does not indicate that focus left the entire widget. Returning to the trigger can fire
`onFocus`; no whole-widget focus tracking is provided.

## Value updates and reset

Reset by passing a new `value` from the parent or by calling React Hook Form's `reset()`.
SelectBox does not implement native reset handling, cancellation, callback suppression,
primitive remounts, or special reset focus restoration. Native `form.reset()` and reset
buttons retain Radix/browser behavior; they are not a substitute for resetting owner state.
No wrapper-specific native reset guarantees are provided.

Option updates do not rewrite the consumer's value. If its option is missing, including
temporary `options=[]`, the trigger shows the placeholder and Radix receives `""`. Returning
the option restores its display. No first option is selected automatically. Empty lists
cannot open, but the trigger stays focusable; all-disabled lists can open for inspection.
The wrapper controls only open state to enforce those rules and close when disabled.

A selected option becoming disabled remains visible, but cannot be newly selected. Radix
manages user interaction and calls `onValueChange`; the wrapper does not duplicate its
selection checks. With native `FormData`, unknown values submit an empty string and selected
disabled options may be omitted. A disabled SelectBox is omitted as well. The form owner
must decide whether loading/missing options permit submission. Form library values remain
owned by that library and can differ from native FormData in these cases.

## Appearance, keyboard, and Portal

Default, Hover, Open (design Active), Focus, and Disabled use shared tokens. Selected and
highlighted items are independent: selected has semantic selection without a checkmark;
highlighted enabled items use accent text and a 60% background without fading their text.
Disabled options have dark text and no highlight.

Trigger and items are 36px high, with single-line ellipsis. Trigger padding is 6px 12px;
an inset frame preserves the 24px text line. Label has no extra gap. Width follows the
parent container. The decorative arrow is `public/icons/chevron-down.svg`, displayed as a
CSS mask using the existing color token. Trigger rotation follows Radix's `data-state`
with a 180ms `ease` transform transition on opening and closing, disabled by
`prefers-reduced-motion: reduce`. Scroll buttons reuse the resource without this transition.

Radix owns keyboard navigation, typeahead, Escape, and focus return. Closed-trigger typeahead
can select an enabled option directly; open-list navigation highlights without selecting.
The open list blocks Tab: choose an item or press Escape, then continue Tab navigation.

The list portals to `document.body`, uses popper positioning below/start without a gap,
and can flip or shift at viewport edges. Width follows the trigger; height is capped at
288px and available viewport space. It scrolls through the Radix viewport and scroll buttons.
Content has a local z-index of 1; modal layers and native dialog top-layer integration need
consumer verification. No search, multiple selection, virtualization, or loading UI is added.

## Scroll locking and global CSS integration

Radix owns document scroll locking and scrollbar compensation. A non-zero body margin
while the list is open is expected; it must compensate for the scrollbar rather than
be removed indiscriminately. The component does not override this margin or hard-code
a scrollbar width.

The integration rule is in [src/app/globals.css](../../../app/globals.css):
`overflow-x: clip` is applied only to `body`. `html` keeps its existing height and
maximum width without an overflow override. No global override is duplicated in the
component's CSS Module.

With horizontal clipping on both `html` and `body`, locking the body could leave the
viewport scrollbar in place while adding its compensation margin. This narrowed normal
page content. Opening the list after scrolling could also move the sticky Sidebar out
of view. Keeping the root overflow visible lets the body lock control the viewport;
the scrollbar disappears and the measured compensation preserves normal-flow width.
The change affects every route, including routes without SelectBox.

Joint browser checks with the actual Sidebar and SelectBox used Chrome 156 on Windows,
1440px and 768px widths, short and long pages, top/middle/bottom triggers, mouse and
keyboard selection, Escape, outside-click closing, and background wheel attempts.
Body-only clipping avoided the visible horizontal jump and preserved Sidebar positioning;
rounding differences were at most 0.2 CSS px. Both body-only `hidden` and `clip` were
investigated; the selected rule is `clip`. These checks are not a cross-browser guarantee.

Known limitations and verification boundaries:

- At 375px, the current Sidebar/main layout can overflow horizontally. Focusing the
  field can then scroll the document sideways even with a body-only overflow rule.
  In mobile Chromium emulation, this overflow also produced incorrect scrollbar
  compensation despite overlay scrollbars. Temporarily allowing `main` to shrink with
  `min-width: 0` removed that compensation in the probe; no layout change is included
  in this component. A responsive layout must fit its viewport before mobile behavior
  can be accepted. Hiding the scrollbar alone does not resolve this separate issue.
- Right-anchored fixed UI can move when the viewport scrollbar disappears. Earlier
  probes measured about 15.2 CSS px. No general fixed-element compensation is provided.
- An earlier narrow-viewport long-list PageUp/Escape cycle changed vertical scroll
  position by 24px after closing. Focus returned to the trigger and the background
  stayed locked while open; unchanged scroll position is not guaranteed in every case.
- Nested overlays and other scroll-locking controls, including combinations with the
  DatePicker popover, require separate integration checks. Touch selection was checked
  in mobile Chromium emulation, not on physical devices. Safari, Firefox, real Android
  and iOS devices, RTL, and browser zoom remain unverified.
- Inter is not loaded; glyph appearance has not been verified against that font.
