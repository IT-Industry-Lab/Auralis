# Header

A controlled desktop application header with guest and authenticated variants. Import through
`@/widgets/Header` and render inside the application's browser-only boundary. Shared global styles
must already be loaded as described in `DESIGN.md`.

## Public API

```ts
type HeaderProps = {
  isAuthenticated: boolean;
  languageOptions: readonly SelectBoxOption[];
  languageValue: string;
  onLanguageChange: (value: string) => void;
  onNotificationsClick: () => void;
};
```

`Header` and `HeaderProps` are exported from the widget's public `index.ts`.
`SelectBoxOption` comes from the public API of `@/shared/ui/SelectBox`: each option has a unique
non-empty `value`, a plain-text `label`, and an optional decorative `icon` or `disabled` flag.

The parent explicitly supplies `isAuthenticated`. The widget does not infer authentication from
routes, user data, or another widget. There is no backend integration, user request, authentication
store, token handling, or persistence.

The parent owns language options and selection. Header only forwards selection changes to
`onLanguageChange`. It does not translate content, change locale routes, or implement i18n.

## Both variants

The following examples assume a browser-only parent supplies the controlled language props and
notification handler:

```tsx
import { Header } from '@/widgets/Header';

// Guest: logo, language selection, Log in, and Sign up.
<Header
  isAuthenticated={false}
  languageOptions={languageOptions}
  languageValue={languageValue}
  onLanguageChange={setLanguageValue}
  onNotificationsClick={handleNotificationsClick}
/>;

// Authenticated: logo, notification button, and language selection.
<Header
  isAuthenticated={true}
  languageOptions={languageOptions}
  languageValue={languageValue}
  onLanguageChange={setLanguageValue}
  onNotificationsClick={handleNotificationsClick}
/>;
```

## Actions and navigation

- The logo links to `ROUTES.feed` (`/`). Its SVG is extracted from the supplied reference and stored
  in `public/icons/header/logo.svg`.
- Log in links to `ROUTES.signIn` (`/sign-in`); Sign up links to the existing `/register` route.
  Both use `next/link` through `Button`'s existing `asChild` API. No buttons and links are nested
  inside one another in the rendered HTML.
- The notification control is a native button named `Notifications`, with a 36 × 36px target and
  the original 24 × 24px SVG resource from `public/icons/header/notification-bell.svg`.
  It is a placeholder that only calls `onNotificationsClick`. The parent decides what that callback
  does. There is no badge, notification list, request, or toast integration.
- SelectBox retains its own styles and Radix keyboard behavior. Header provides its accessible
  name and a 163px-wide container; it does not override the shared component's styles.

## Desktop layout and limitations

Header fills its containing block (`width: 100%`) and stays 60 CSS pixels high, using
`--color-dark-700` for its background and an inset 1px `--color-dark-300` bottom divider.
Its centered container has a maximum outer width of 1280px, including 60px left and 64px right padding.
The maximum usable content width is therefore **1280 − 60 − 64 = 1156px**.
These dimensions come from the supplied 1280 × 720 main-page SVG: the logo box starts at x=60 and
the language field ends at x=1216. The authenticated action gap is 42px between the 36px notification
target and the 163px language field. Authentication links keep the agreed 24px gap.

The container shrinks with the available desktop width, and controls use normal flex layout rather
than absolute viewport offsets. Header does not introduce a horizontal scrolling container.
Header itself remains in normal flow; positioning belongs to the application shell.

Mobile responsive layouts are not implemented. There are no mobile breakpoints, collapsed controls,
or wrapping rules. The desktop container's fluid width is not a complete mobile layout.

Button and SelectBox implementations, APIs, and styles are unchanged. Typography inherits the
application font family and uses the existing typography tokens. Inter is not loaded yet, so text
metrics and resulting shared Button widths may differ from the reference. The Primary button's
contrast limitation documented in `DESIGN.md` remains unresolved.

Header is not connected to the global application shell. The proposed integration point is above
the existing Sidebar/main row, once the application can supply the agreed authentication state.

## Completed local preview

A temporary browser-only preview was used for automated checks and manual developer review. It owned
the mock authentication toggle, two distinct option values both labelled `English`, a 20 × 20px flag,
local selection state, and a visible count of notification callback invocations. None of those mocks
or demonstration behaviors were part of Header itself. Selection reset on remount; no i18n or
authentication integration was implemented.

After manual acceptance, the preview route, page module, flag/reference assets, screenshots, and local
verification script were removed. They are not included in the deliverable. Header remains an
unconnected widget; future Russian/English support and application-shell integration are separate
tasks.

## Verification

- `pnpm.cmd build` passed after preview removal. The final route table does not include
  `/header-preview`. Before removal, browser checks confirmed that Header and preview application
  UI were absent from the initial server HTML.
- `pnpm.cmd exec tsc --noEmit` passed.
- `pnpm.cmd exec stylelint src/widgets/Header/ui/Header.module.css` passed.
- `pnpm.cmd exec prettier --check src/widgets/Header` passed.
  Both SVG resources passed a separate Prettier check with `--parser html`.
- `pnpm.cmd lint` completed successfully, but the existing ESLint configuration does not cover
  TypeScript/TSX. Explicitly checking `Header.tsx` reported it as ignored.
  This is a verification gap, not a successful TypeScript lint check.
- Before preview removal, browser checks passed for both variants, full available Header width,
  60px height, the centered
  container and its padding, exact SelectBox dimensions, loaded images,
  accessible control names, Tab order, visible bell focus, Enter/Space/click callbacks, keyboard and
  pointer language selection, Escape and focus return, and all three client-side navigation links.
  Preview state reset on reload. Opening SelectBox did not move the Sidebar in the desktop check.
- Both variants were checked at 1024, 1280, 1440, and 1920px browser viewport widths in an isolated
  context at 100% zoom. Header followed the actual available document width, its container stayed
  centered and capped at 1280px, and the page had no horizontal overflow at these widths.
  Header stayed at y=0 during vertical scrolling. The dropdown was not covered by the sticky host.
  Navigating away removed the preview portal; browser Back restored exactly one Header.
  Mobile layouts remain unimplemented and unverified.
- `git diff --check` passed. No old `@/widget/` or `src/widget/` imports remain. All seven moved
  AppSidebar files retained their original SHA256 hashes. Shared components were not modified.

Browser checks used the available Chromium session. Other browsers, physical devices, full WCAG
conformance, and real authentication/i18n integrations were not verified. No UI test dependencies
or project configuration were added.
