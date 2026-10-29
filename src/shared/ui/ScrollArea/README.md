# ScrollArea

A local, size-constrained scroll container for lists and panels, built on
`@radix-ui/react-scroll-area@1.4.0`. It preserves native scrolling and child semantics.
It does not size the parent, fetch data, virtualize lists, or manage scroll position.
Keep page scrolling native. Render application UI inside the application's browser-only
boundary; `'use client'` alone does not disable Next.js prerendering.

## API

| Prop                                                 | Meaning                                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `children: ReactNode`                                | Content inside the Viewport.                                                                        |
| `className?: string`                                 | Root sizing and placement. Preserve its reserved scrollbar space.                                   |
| `orientation?: 'vertical' \| 'horizontal' \| 'both'` | Enabled axes; defaults to `vertical`.                                                               |
| `ref?: Ref<HTMLDivElement>`                          | The actual scrolling **Viewport**, not the Root or content wrapper.                                 |
| `viewportProps?: ScrollAreaViewportProps`            | `id`, `role`, `aria-label`, `aria-labelledby`, `aria-describedby`, `tabIndex`, all on the Viewport. |

The Viewport has `tabIndex={0}` and a visible focus outline by default, including when
there is no overflow. Use a meaningful accessible name for an independently navigable
region, for example `role: 'region'` with `aria-labelledby` pointing to a visible heading.
No region role or generic name is imposed. Consumers may override `tabIndex`, but must
retain a keyboard path to scroll all content. Child controls keep their own semantics
and tab order. Radix owns pointer dragging; no additional scrollbar ARIA is added.

## Sizing and composition

Import from `@/shared/ui/ScrollArea`. The parent must provide a constrained width and a
definite height (or a definite allocated flex/grid size). `max-height` alone is not a
substitute for a definite height. Percentage heights require a definite ancestor height.

```tsx
<section className={styles.panel}>
  <h2 id="updates-title">Updates</h2>
  <ScrollArea
    className={styles.list}
    viewportProps={{ role: 'region', 'aria-labelledby': 'updates-title' }}
  >
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  </ScrollArea>
</section>
```

```css
.panel {
  display: flex;
  flex-direction: column;
  width: 320px;
  max-width: 100%;
  height: 360px;
  min-width: 0;
  min-height: 0;
}

.list {
  flex: 1;
  min-height: 0;
}
```

The heading stays outside the Viewport and remains stationary. Use the same pattern
for a search field above a dialog list. Intermediate flex/grid items may also need
`min-width: 0` and `min-height: 0`; grid tracks can use `minmax(0, 1fr)`.
The Root already has both minimum sizes set to zero.

```tsx
<ScrollArea
  orientation="horizontal"
  className={styles.timeline}
  viewportProps={{ role: 'region', 'aria-label': 'Timeline' }}
>
  <div className={styles.wideContent}>Wide content</div>
</ScrollArea>
```

```css
.timeline {
  width: 100%;
  height: 160px;
}

.wideContent {
  width: 960px;
}
```

Use `orientation="both"` when content needs both axes. The disabled axis is hidden by
Radix; horizontal-only content must fit the available height. Vertical mode wraps long
text and uses a block content wrapper to prevent Radix's intrinsic table sizing from
widening ordinary lists. Consumers must still make fixed-width children, images, tables,
and nested flex items fit, or select `both`; oversized children can otherwise be clipped.

Each ScrollArea resets inherited `overflow-wrap` to `normal` at its Root. Only its own
vertical Content applies `overflow-wrap: anywhere` and `width: 100%`. A nested horizontal
or `both` instance therefore keeps normal wrapping, including inside a vertical panel:
long unbroken strings can overflow horizontally without requiring `white-space: nowrap`.
Normal spaces can still wrap; consumers choose any additional text formatting.

## Programmatic scrolling

```tsx
const viewportRef = useRef<HTMLDivElement>(null);

<button type="button" onClick={() => viewportRef.current?.scrollBy({ top: 120 })}>
  Scroll down
</button>
<ScrollArea ref={viewportRef} className={styles.list}>
  {children}
</ScrollArea>
```

`viewportRef.current?.scrollTo({ top: 0, left: 0 })` also works. There is no controlled
position, automatic chat scrolling, or mandatory smooth scrolling.

## Appearance and limits

- Confirmed design: visible thumb thickness **4px**, radius **2px**, Default
  `--color-dark-300` (`#333333`), Hover `--color-light-900` (`#8D9094`).
- Technical choice: a transparent **16px** track and full-width/height thumb hit area,
  with a centered 4px pseudo-element. Hover anywhere on the track changes the thumb color.
  No transition is used. Radix computes thumb length and position, including its minimum length.
- The Root permanently reserves **16px on the right** for a vertical axis and **16px
  at the bottom** for a horizontal axis, even without overflow. The Viewport excludes
  these gutters, so content cannot sit underneath the scrollbar and overflow changes
  do not shift its width. No other content padding is supplied: spacing for rows, list
  markers and child focus rings belongs to the consumer. Do not override Root padding.
- `type="auto"` shows each scrollbar only while its axis overflows, independent of hover.
  Radix observes Viewport and content size changes. No page scroll lock is applied.
- Wheel, trackpad, keyboard and touch use native browser/Radix behavior. Scrolling can
  chain to the outer page at an edge. Browser-specific interactions may differ.
- This wrapper currently targets LTR layouts; RTL layout/track placement is not part of
  its API. Custom scrollbar contrast depends on the consumer's background; the confirmed
  dark Default is low contrast on black. No claim of complete accessibility conformance
  or testing with assistive technologies is made.
