'use client';

import * as Select from '@radix-ui/react-select';
import {
  useEffect,
  useId,
  useState,
  type AriaAttributes,
  type CSSProperties,
  type FocusEventHandler,
  type ReactNode,
  type Ref,
} from 'react';

import styles from './SelectBox.module.css';

export type SelectBoxOption = Readonly<{
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}>;

type AccessibleName = { label: string } | { 'aria-label': string } | { 'aria-labelledby': string };

export type SelectBoxProps = AccessibleName & {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectBoxOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  form?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: AriaAttributes['aria-invalid'];
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
};

function OptionIcon({ children }: { children: ReactNode }) {
  return (
    <span className={styles['option-icon']} aria-hidden="true" inert>
      {children}
    </span>
  );
}

export function SelectBox({
  options,
  value,
  onValueChange,
  placeholder,
  label,
  disabled = false,
  name,
  required,
  form,
  id,
  className,
  style,
  ref,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
}: SelectBoxProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const effectiveValue = selectedOption?.value ?? '';

  if (process.env.NODE_ENV !== 'production') {
    if (!label?.trim() && !ariaLabel?.trim() && !labelledBy?.trim()) {
      throw new Error('SelectBox requires a label, aria-label, or aria-labelledby.');
    }
    const values = new Set<string>();
    for (const option of options) {
      if (!option.value.trim() || !option.label.trim() || values.has(option.value)) {
        throw new Error('SelectBox options require unique non-empty values and non-empty labels.');
      }
      values.add(option.value);
    }
  }

  useEffect(() => {
    if (disabled || options.length === 0) setOpen(false);
  }, [disabled, options.length]);

  return (
    <div className={styles.root}>
      {label && (
        <label className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
      )}
      <Select.Root
        value={effectiveValue}
        onValueChange={onValueChange}
        open={open && !disabled && options.length > 0}
        onOpenChange={(nextOpen) => setOpen(nextOpen && !disabled && options.length > 0)}
        disabled={disabled}
        name={name}
        required={required}
        form={form}
      >
        <Select.Trigger
          id={triggerId}
          ref={ref}
          form={form}
          className={[styles.trigger, className].filter(Boolean).join(' ')}
          style={style}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span className={styles.value}>
            <Select.Value placeholder={<span className={styles.text}>{placeholder}</span>}>
              {selectedOption && (
                <>
                  {selectedOption.icon != null && <OptionIcon>{selectedOption.icon}</OptionIcon>}
                  <span className={styles.text}>{selectedOption.label}</span>
                </>
              )}
            </Select.Value>
          </span>
          <Select.Icon className={styles.chevron}>
            <span className={styles.arrow} aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className={styles.content}
            position="popper"
            side="bottom"
            align="start"
            sideOffset={0}
            avoidCollisions
            collisionPadding={10}
          >
            <Select.ScrollUpButton className={styles['scroll-up']}>
              <span className={styles.arrow} aria-hidden="true" />
            </Select.ScrollUpButton>
            <Select.Viewport className={styles.viewport}>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  textValue={option.label}
                  disabled={option.disabled}
                  aria-selected={option.value === effectiveValue}
                  className={styles.item}
                >
                  {option.icon != null && <OptionIcon>{option.icon}</OptionIcon>}
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className={styles['scroll-down']}>
              <span className={styles.arrow} aria-hidden="true" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
