'use client';

import type { FC, ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './CustomTabs.module.css';

interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  tabs: TabItem[];
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}

export const CustomTabs: FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  tabs,
  children,
  className = '',
  orientation = 'horizontal',
  activationMode = 'automatic',
}) => {
  return (
    <Tabs.Root
      className={`${styles.root} ${className}`.trim()}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      activationMode={activationMode}
    >
      <Tabs.List className={styles.list} aria-label="Tabs navigation">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            className={styles.trigger}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {children}
    </Tabs.Root>
  );
};

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabContent: FC<TabContentProps> = ({ value, children, className = '' }) => (
  <Tabs.Content className={`${styles.content} ${className}`.trim()} value={value}>
    {children}
  </Tabs.Content>
);
