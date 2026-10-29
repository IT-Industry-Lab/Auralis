'use client';

import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import styles from './ScrollArea.module.css';

export type ScrollAreaViewportProps = Pick<
  ComponentPropsWithoutRef<'div'>,
  'id' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'tabIndex'
>;

export type ScrollAreaProps = {
  children: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
  viewportProps?: ScrollAreaViewportProps;
};

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { children, className, orientation = 'vertical', viewportProps },
  ref
) {
  const vertical = orientation !== 'horizontal';
  const horizontal = orientation !== 'vertical';

  return (
    <RadixScrollArea.Root
      type="auto"
      className={[styles.root, styles[orientation], className].filter(Boolean).join(' ')}
    >
      <RadixScrollArea.Viewport
        tabIndex={0}
        {...viewportProps}
        ref={ref}
        className={styles.viewport}
        disableImplicitContentElement
      >
        <RadixScrollArea.Content
          className={styles.content}
          style={orientation === 'vertical' ? { display: 'block' } : undefined}
        >
          {children}
        </RadixScrollArea.Content>
      </RadixScrollArea.Viewport>
      {vertical && (
        <RadixScrollArea.Scrollbar orientation="vertical" className={styles.scrollbar}>
          <RadixScrollArea.Thumb className={styles.thumb} />
        </RadixScrollArea.Scrollbar>
      )}
      {horizontal && (
        <RadixScrollArea.Scrollbar orientation="horizontal" className={styles.scrollbar}>
          <RadixScrollArea.Thumb className={styles.thumb} />
        </RadixScrollArea.Scrollbar>
      )}
      {vertical && horizontal && <RadixScrollArea.Corner />}
    </RadixScrollArea.Root>
  );
});
