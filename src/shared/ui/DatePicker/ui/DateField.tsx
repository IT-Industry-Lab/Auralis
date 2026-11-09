import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import type { DatePickerBaseProps } from '../types';
import styles from './DateField.module.css';

type DateFieldProps = DatePickerBaseProps & {
  mode: 'single' | 'range';
  input: {
    text: string;
    changeText: (text: string) => void;
    resetDraft: () => void;
  };
  children: (close: () => void) => ReactNode;
};

export function DateField({
  mode,
  input,
  children,
  label,
  error,
  labels,
  minDate,
  maxDate,
  onInputValidationChange,
  id,
  className,
  style,
  disabled,
  readOnly,
  onBlur,
  onKeyDown,
  placeholder,
  'aria-invalid': ariaInvalid,
  'aria-describedby': describedBy,
  ...props
}: DateFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${generatedId}-error`;
  const popupId = `${generatedId}-calendar`;
  const hasError = Boolean(error);
  const invalid = hasError || ariaInvalid === true || ariaInvalid === 'true';
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || readOnly) setOpen(false);
  }, [disabled, readOnly]);

  useEffect(() => {
    const field = rootRef.current?.querySelector('input');
    const form = field?.form;
    if (!form) return;

    let active = true;
    const reset = (event: Event) => {
      // React onReset and later native listeners must have a chance to cancel first.
      setTimeout(() => {
        if (!active || event.defaultPrevented) return;
        input.resetDraft();
        setOpen(false);
      }, 0);
    };
    form.addEventListener('reset', reset);
    return () => {
      active = false;
      form.removeEventListener('reset', reset);
    };
  }, [input.resetDraft]);

  return (
    <Popover.Root open={open && !disabled && !readOnly} onOpenChange={setOpen}>
      <div
        ref={rootRef}
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={style}
        data-mode={mode}
        data-disabled={disabled || undefined}
        onBlur={(event) => {
          const next = event.relatedTarget;
          if (!rootRef.current?.contains(next) && !contentRef.current?.contains(next)) onBlur?.();
        }}
      >
        {label && (
          <label className={styles.label} htmlFor={fieldId}>
            {label}
          </label>
        )}
        <Popover.Anchor asChild>
          <div
            className={styles.control}
            data-invalid={invalid || undefined}
            data-open={open || undefined}
          >
            <input
              {...props}
              id={fieldId}
              type="text"
              value={input.text}
              placeholder={
                placeholder ?? (mode === 'range' ? 'DD/MM/YYYY - DD/MM/YYYY' : 'DD/MM/YYYY')
              }
              disabled={disabled}
              readOnly={readOnly}
              autoComplete={props.autoComplete ?? 'off'}
              className={styles.input}
              aria-haspopup="dialog"
              aria-expanded={open && !disabled && !readOnly}
              aria-controls={open ? popupId : undefined}
              aria-invalid={hasError ? true : ariaInvalid}
              aria-describedby={
                [describedBy, hasError ? errorId : undefined].filter(Boolean).join(' ') || undefined
              }
              onChange={(event) => input.changeText(event.target.value)}
              onKeyDown={(event) => {
                onKeyDown?.(event);
                if (
                  !event.defaultPrevented &&
                  event.key === 'ArrowDown' &&
                  !readOnly &&
                  !disabled
                ) {
                  event.preventDefault();
                  setOpen(true);
                }
              }}
            />
            <Popover.Trigger asChild>
              <button
                type="button"
                className={styles.trigger}
                disabled={disabled || readOnly}
                aria-label={labels?.openCalendar ?? 'Choose date'}
                aria-controls={popupId}
              >
                <Image
                  src={`/icons/date-picker/calendar${invalid ? '-error' : open ? '-active' : ''}.svg`}
                  width={24}
                  height={24}
                  alt=""
                />
              </button>
            </Popover.Trigger>
          </div>
        </Popover.Anchor>
        {hasError && (
          <div className={styles.error} id={errorId}>
            {error}
          </div>
        )}
        <Popover.Portal>
          <Popover.Content
            id={popupId}
            ref={contentRef}
            className={styles.popup}
            align="start"
            sideOffset={0}
            collisionPadding={8}
            aria-label={labels?.calendar ?? label ?? 'Calendar'}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (event.target instanceof Node && rootRef.current?.contains(event.target)) {
                event.preventDefault();
              }
            }}
          >
            {children(() => setOpen(false))}
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}
