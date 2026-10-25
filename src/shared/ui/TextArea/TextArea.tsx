'use client';

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from 'react';

import styles from './TextArea.module.css';

export type TextAreaProps = Omit<ComponentPropsWithRef<'textarea'>, 'children'> & {
  label?: string;
  error?: string;
};

export function TextArea({
  label,
  error,
  id,
  ref,
  value,
  defaultValue,
  disabled,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${generatedId}-error`;
  const hasError = Boolean(error);
  const elementRef = useRef<HTMLTextAreaElement>(null);
  const [uncontrolledFilled, setUncontrolledFilled] = useState(
    () => String(defaultValue ?? '').length > 0
  );
  const controlled = value !== undefined;
  const filled = controlled ? String(value).length > 0 : uncontrolledFilled;

  const attachRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element) return;

      elementRef.current = element;
      let resetTimer: ReturnType<typeof setTimeout> | undefined;
      const updateFilled = () => {
        if (!controlled) setUncontrolledFilled(element.value.length > 0);
      };
      const handleReset = (event: Event) => {
        if (event.target !== element.form) return;

        // A task reads the actual value after the native reset default action.
        clearTimeout(resetTimer);
        resetTimer = setTimeout(updateFilled, 0);
      };
      const resetRoot = element.getRootNode();

      element.addEventListener('input', updateFilled);
      element.addEventListener('change', updateFilled);
      // Capture resets for the current form, including one mounted after this field.
      resetRoot.addEventListener('reset', handleReset, true);
      updateFilled();

      const cleanupRef = typeof ref === 'function' ? ref(element) : undefined;
      if (ref && typeof ref !== 'function') ref.current = element;

      return () => {
        elementRef.current = null;
        clearTimeout(resetTimer);
        element.removeEventListener('input', updateFilled);
        element.removeEventListener('change', updateFilled);
        resetRoot.removeEventListener('reset', handleReset, true);

        if (typeof cleanupRef === 'function') cleanupRef();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      };
    },
    [ref, controlled]
  );

  useLayoutEffect(() => {
    if (!controlled && elementRef.current) {
      setUncontrolledFilled(elementRef.current.value.length > 0);
    }
  }, [controlled, defaultValue]);

  return (
    <div className={styles.root}>
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        id={fieldId}
        ref={attachRef}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        className={[styles.field, className].filter(Boolean).join(' ')}
        data-filled={filled || undefined}
        aria-describedby={
          [describedBy, hasError ? errorId : undefined].filter(Boolean).join(' ') || undefined
        }
        aria-invalid={hasError ? true : ariaInvalid}
      />
      {hasError && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
