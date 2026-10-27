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

## Scroll locking and horizontal layout

The developer manually verified the horizontal fix using a temporary preview, which has
since been removed. The previous horizontal jump no longer occurred in that preview and
the main behavior was accepted.
This verification does not remove the limitations below.

The source of truth is [src/app/globals.css](../../../app/globals.css). Horizontal clipping
is assigned to `body` only; `html` retains its existing height and maximum width without
its former `overflow-x: hidden`. This is a global change affecting every route, including
routes without SelectBox. There is no duplicate override in the component's CSS Module.

Previously, horizontal overflow hiding on both html and body created two scroll containers.
Radix locked body and added scrollbar compensation, while html kept the viewport scrollbar.
The extra margin narrowed the page. With body-only clipping, the body lock reaches the
viewport, its scrollbar disappears, and Radix's measured margin compensates for that space.
No scrollbar width is hard-coded and Radix's margin is not overridden.

This fix leaves Radix's scroll locking, focus handling, list scrolling, and controlled
API intact. Background wheel and PageUp/PageDown attempts did not scroll the page while
the list was open in the tested browser. A margin-only override was rejected because
PageDown still scrolled the background; it is not included in the final change.

Production-browser checks used Chrome 156 on Windows: 375, 1000, and 1440px viewport widths;
pages with and without vertical overflow; top/middle/bottom triggers; mouse and keyboard
opening; Escape, selection, and outside-click closing; repeated cycles; and 250 items.
Horizontal changes of normal-flow content were at most 0.2 CSS px in these measurements.
Long overflowing content remained horizontally clipped. The home route and 404 page were
also checked. Temporary fixed/sticky probes were added in the browser and then removed;
no permanent demo infrastructure was introduced.

Remaining limitations, rather than universal compatibility claims:

- A plain fixed element anchored to the viewport's right edge moved by the scrollbar space
  when the scrollbar disappeared (about 15.2 CSS px in the probe). Left-anchored fixed and
  sticky probes stayed stable apart from rounding. There are no existing fixed/sticky app
  components; future right-anchored or full-width fixed UI needs its own scroll-lock
  compensation integration. This fix does not add a global fixed-element workaround.
- At the bottom of the narrow viewport, an initial long-list PageUp/Escape cycle reproduced
  a 24px vertical scroll change after closing. Focus returned to the trigger and the
  background stayed locked while open, but unchanged scroll position is not guaranteed in
  this edge case. The developer accepts this documented limitation for this version.
  A local scroll-anchoring experiment did not fix it and was removed.
- No dialog or other scroll-locking UI is implemented in this repository, so nested locks
  and dialog interactions were not tested. Other browsers, touch devices, overlay scrollbar
  settings, RTL, and browser zoom configurations remain unverified.
- Inter is not loaded; glyph appearance has not been verified against that font.
