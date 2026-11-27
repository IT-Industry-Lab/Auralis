# DatePicker

Controlled single-date and date-range input built with `@daypicker/react@10.0.2` and
`@radix-ui/react-popover@1.3.1`. Use it inside the application's browser-only boundary, as required
by AGENTS.md. A client directive alone does not disable Next.js prerendering. No per-instance
dynamic wrapper is needed inside an existing browser-only application boundary.

Import the component and types through the public API:

```tsx
import { DatePicker, type DateRange } from '@/shared/ui/DatePicker';

const [birthday, setBirthday] = useState<Date | null>(null);
const [period, setPeriod] = useState<DateRange | null>(null);

<DatePicker label="Date of birth" value={birthday} onChange={setBirthday} />;
<DatePicker mode="range" label="Period" value={period} onChange={setPeriod} />;
```

Import `useState` from React in the consuming Client Component. There is no uncontrolled mode.

## Contract

| Prop                      | Meaning                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                    | `single` (default) or `range`. Discriminates the value and callback types.                                                                     |
| `value`                   | Single: `Date \| null`. Range: `{ from: Date; to: Date } \| null`, with both dates present.                                                    |
| `onChange`                | Receives the next value or `null` when text is empty, incomplete, invalid, or outside the supplied bounds.                                     |
| `onInputValidationChange` | Receives `{ text, status }` on user edits and calendar commits. Status is `empty`, `valid`, or `invalid`; incomplete nonempty text is invalid. |
| `label`                   | Visible label associated with the input. Otherwise supply `aria-label` or `aria-labelledby`.                                                   |
| `error`                   | Externally supplied `ReactNode`; may include a link. Adds the error style, `aria-invalid`, and description ID.                                 |
| `minDate`, `maxDate`      | Inclusive calendar-day limits for both typing and selection; time of day is ignored.                                                           |
| `onBlur`                  | Notifies the consumer when focus leaves the field and its calendar, rather than when moving between their controls.                            |
| `ref`                     | The native text input, allowing RHF or consumers to focus it. React 19 refs are supported.                                                     |
| `className`, `style`      | Apply to the root wrapper, including width. The field fills its container.                                                                     |
| `labels`                  | Optional `openCalendar`, `calendar`, `previousMonth`, and `nextMonth` accessible strings.                                                      |

Other native input props, including `name`, `required`, `disabled`, `readOnly`, `form`, `placeholder`,
keyboard handlers, and ARIA descriptions, are forwarded to the input. `value`, `defaultValue`, `type`,
native `min`/`max`, and the native change/blur handlers are replaced by the component's contract.
Existing `aria-describedby` IDs are preserved. `aria-invalid={true}` also enables error styling
without a message. Business validation and the decision when to show an error belong to the consumer.

Values must contain valid local `Date` instances with years 1–9999. Range start must not follow end;
`minDate` must not follow `maxDate`. Do not mutate supplied Date objects. Calendar dates represent
year/month/day, not UTC instants: serialize at the consuming API boundary using the required date-only
format, rather than `toISOString().slice(0, 10)`.

## Editing and selection

- Display format is `DD/MM/YYYY`, or `DD/MM/YYYY - DD/MM/YYYY` for ranges. Text entry also accepts
  `DD.MM.YYYY` and an en dash between range endpoints. There is no input mask or automatic guessing.
- Typed text remains visible while editing, including incomplete and impossible dates. Valid typed
  text is preserved as entered; choosing from the calendar formats it with slashes. A different
  external value discards that draft permanently, so a later clear cannot restore old input.
- Each edit reports validation status before calling `onChange`. Invalid input clears the public
  selection to `null`, so the previous valid date cannot silently be submitted.
- `null` alone cannot distinguish invalid input from an intentionally empty optional field. Forms
  that allow empty dates must also validate the reported input status. See the RHF example below.
- Calendar range selection uses two clicks, including when both endpoints are the same day. The first
  click is an internal draft; only the second commits a complete range. Closing cancels the draft.
- Single selection and completed ranges close the popup. The icon or ArrowDown opens it; DayPicker
  owns calendar keyboard navigation, including month/year navigation. Escape and outside interaction
  close it. Radix returns focus to the trigger where appropriate. Typing directly into the input
  remains possible while the popup is open. Text edits and value updates do not remount the open
  calendar or reapply its initial autofocus. Each opening starts at the selected date (range start),
  or today, clamped to the supplied bounds.
- `disabled` disables both controls; `readOnly` keeps the text focusable but disables editing and
  opening the calendar. Weekends are colored, not disabled. Days of adjacent months remain selectable
  unless outside the bounds.
- External value changes update the field. Native form reset clears the local text draft but does
  not change the controlled value; the consumer must reset that value too. Reset handling is deferred
  until the event finishes propagating; a reset canceled by a native listener or React `onReset`
  preserves both the text draft and the open calendar. If programmatically
  resetting an invalid/partial draft when `value` is already `null`, remount with a new React `key`:
  there is no value change from which the component could infer this reset. Reset any consumer-held
  validation status together with the form.

The calendar currently uses English month/day names and Monday as the first weekday, matching the
reference. The label strings do not change calendar localization. Additional calendar locales and
configurable text formats are outside this first API.

## React Hook Form

The component does not import RHF or Zod. Connect it from the form with `Controller`. A ref holds the
latest parse status synchronously, so validation sees it during the same edit; it also protects
optional fields from accepting a nonempty invalid draft as an empty date.

```tsx
const inputState = useRef<DatePickerInputState>({ text: '', status: 'empty' });
const [resetVersion, setResetVersion] = useState(0);
const { control, handleSubmit, reset } = useForm<{ birthday: Date | null }>({
  defaultValues: { birthday: null },
  mode: 'onBlur',
});

<Controller
  name="birthday"
  control={control}
  rules={{
    validate: () => inputState.current.status !== 'invalid' || 'Enter a valid date',
  }}
  render={({ field, fieldState }) => (
    <DatePicker
      key={resetVersion}
      {...field}
      label="Date of birth"
      error={fieldState.error?.message}
      onInputValidationChange={(state) => {
        inputState.current = state;
      }}
    />
  )}
/>;

function resetBirthday() {
  inputState.current = { text: '', status: 'empty' };
  reset();
  setResetVersion((version) => version + 1);
}
```

Import `useRef` / `useState` from React, `Controller` / `useForm` from RHF, and
`DatePickerInputState` from the DatePicker public API. Submit through `handleSubmit`. Add age,
required-field, and other business checks in the form. If adopting a schema resolver later, carry
the raw-input validity into that validation model; validating `Date | null` alone cannot detect an
invalid nonempty draft. Zod and resolvers are not dependencies of this component.

## Internals and checks

`DatePicker.tsx` dispatches by mode. The two mode adapters connect values to the shared text-editing
hook, `DateField` owns the input/popover composition, and `Calendar` styles DayPicker and handles the
two-click range draft. `lib/date.ts` contains pure parsing, formatting, and day-bound comparisons.
The internal files are not exported.

Run the focused date checks without adding a runner or changing project scripts:

```sh
node --test src/shared/ui/DatePicker/lib/date.test.mjs
```

They use Node's built-in test runner and the existing TypeScript compiler. Browser interaction,
form integration, and visual checks remain separate from these pure-function tests.

Styles use DESIGN.md tokens, and icons are local exports from the reference Figma frame. Inter is
not loaded in the existing application, so inherited glyph metrics differ from the design. The
confirmed muted weekday/error colors have known low-contrast combinations on dark backgrounds;
no complete accessibility-conformance claim is made. Palette and font changes require separate
design agreement.
