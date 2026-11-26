import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type SidebarProps = {
  isDisabled?: boolean;
} & ComponentPropsWithoutRef<'aside'>;

export type SidebarNavigationProps = {
  children: ReactNode;
} & ComponentPropsWithoutRef<'nav'>;

export type SidebarItemProps = {
  path?: string;
  icon: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};