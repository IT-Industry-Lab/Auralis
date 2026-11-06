# Notifications

- `src/shared/ui/Alert` exports the visual `Alert`, `AlertProps`, and `AlertVariant`.
  It accepts `variant`, `message`, optional `title`, `closeLabel`, and `onClose`.
  It has no timer, live region, library dependency, or application logic.
- `src/shared/lib/notifications` exports `notify`, `NotifyOptions`,
  `NotificationsContainer`, and `NotificationLabels`.
- `src/_app/providers/Notifications.tsx` mounts the container once from the root
  layout, using `next/dynamic` with `ssr: false`. Mount additional application UI
  within the project's browser-only boundaries as it is introduced.

## Use

Call from browser event handlers or effects, never during rendering or at module scope:

```tsx
import { notify } from '@/shared/lib/notifications';

notify({ variant: 'success', message: 'Your settings are saved' });

notify({
  variant: 'error',
  title: 'Error!',
  message: 'Server is not available',
  durationSeconds: 5,
});

notify({
  variant: 'success',
  title: 'Saved.',
  message: 'Your profile is updated',
  durationSeconds: 10,
});
notify({ variant: 'error', message: 'Please try again', durationSeconds: 2 });
```

```ts
type NotifyOptions = {
  variant: 'success' | 'error';
  message: string;
  title?: string;
  durationSeconds?: number;
};

function notify(options: NotifyOptions): void;
```

The caller supplies translated, user-facing strings. No title is added automatically.
Convert server errors to a meaningful `message` in the consuming feature.

## Lifetime and replacement

`durationSeconds` defaults to **5 seconds** and is converted to milliseconds internally.
If conversion produces a non-finite value, less than 1 ms (including zero and negative
values), or more than 2,147,483,647 ms, it falls back to 5 seconds. Positive fractional
seconds within that range are supported. Invalid values never disable auto-close.

Only the latest notification remains; there is no waiting queue. Every call replaces
the variant, title, message, and duration and starts a fresh timer after entry. The
integration uses React-Toastify's synchronous `toast.update` with a new id and transition;
it dismisses the previous id to replace calls made before the container mounts as well.
Old exit callbacks and timer nodes cannot dismiss the replacement. No `limit` queue,
custom scheduler, or custom timer is used. Use this API rather than calling `toast` directly.

The cross closes manually. Clicking the text does not close. Drag dismissal, default
icons, and the visible progress bar are disabled. Toastify's hidden progress animation
still drives its timer; do not remove it or disable its animation in reduced-motion styles.
Time pauses while hovered, while focus is anywhere inside the toast, and while the window
is unfocused. Overlapping hover/focus pauses remain effective when another pause ends.
The short entry/exit fades become a 1 ms stationary transition with reduced motion.

## Design and accessibility

The supplied SVG confirms a 387 × 48 px border box, a 1 px border, a 2 px radius,
a 14 px drawn cross, white text, and the existing danger/success `900` background
and `500` border tokens. The text starts 24 px from the left edge; the cross center
is 36 px from the right edge.

The SVG outlines its text and does not retain font declarations. The existing body-16 /
body-16-bold recipes are the proposed typography match to the supplied materials.
The application currently inherits Arial; Inter is not loaded, so exact glyph metrics
cannot match the design yet.

Technical choices, not exact screenshot measurements: 24 px bottom/left viewport
offsets, reduced to 16 px at widths up to 480 px, with safe-area protection; a 24 px
icon box preserving the SVG cross position; a 24 px text/button gap; an enlarged
32 px close hit target; 120 ms fades. Width is capped at
387 px and shrinks to fit the viewport. Positioning is fixed over content and does
not change document flow, scrolling, or global overflow rules.

Text stays on one line with CSS ellipsis; the complete strings remain in the DOM
and accessibility tree. A native `title` also exposes the full text on pointer hover.
The close button has a caller-provided accessible name and visible keyboard focus.
Showing a toast never moves focus. Tab can reach the toast and its close button;
Toastify's optional Alt+T shortcut is disabled. The notification is transient, so
do not use it as the only place for essential information or required user actions.

Each success has `role="status"` (polite); each error has `role="alert"` (assertive).
Toastify 11.1.0 hardcodes an additional outer polite region; the container removes
that attribute in a layout effect to avoid nested live regions. This small adapter
must be rechecked if Toastify's markup changes. Real screen-reader announcements
still require manual assistive-technology verification.

There is no localization system yet. Supply both accessible labels at the single
browser-only integration point; the shared modules have no language defaults:

```tsx
<NotificationsContainer labels={{ container: 'Notifications', close: 'Close notification' }} />
```

Do not mount a second container. `react-toastify@11.1.0` is pinned, supports React
and React DOM `^18 || ^19`, and is used through its supported `unstyled` entry;
all visual and timer styles are scoped CSS Modules without default Toastify styling.

## Verification and integration

The repository has no permanent test runner. Chromium checks covered success/error,
optional titles, valid and invalid durations, long strings, rapid replacement before
first display, replacement while visible and during exit, and repeat calls after manual
and automatic close. Checks also covered overlapping hover/focus pauses, window focus
loss, keyboard closing and visible focus, a 320 px viewport, reduced motion, scrolling,
and absence of layout shifts. Production browser checks reported no console errors.
The temporary preview and screenshots were removed after developer acceptance.

This branch depends on `feat/design-system-foundation`. Merge that foundation into
`main` first, then recheck the Alerts diff against `main` before integration.
