'use client';

import { useId, useState } from 'react';
import type { InputProps } from './type';
import styles from './Input.module.css';

export const Input = ({
  value,
  onChange,
  label,
  error,
  fullWidth = false,
  type = 'text',
  id,
  disabled,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const isSearch = type === 'search';

  return (
    <div
      className={[styles.root, fullWidth && styles['full-width'], className]
        .filter(Boolean)
        .join(' ')}
      data-disabled={disabled || undefined}
      data-error={Boolean(error) || undefined}
    >
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.field}>
        {isSearch && <span className={styles.search} aria-hidden="true" />}
        <input
          {...props}
          id={inputId}
          className={styles.input}
          type={isPassword && passwordVisible ? 'text' : type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? true : invalid}
          aria-describedby={[describedBy, error && errorId].filter(Boolean).join(' ') || undefined}
        />
        {isPassword && (
          <button
            className={styles.toggle}
            type="button"
            disabled={disabled}
            aria-label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={passwordVisible}
            aria-controls={inputId}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            <span className={styles.eye} aria-hidden="true" />
          </button>
        )}
      </div>
      {error && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};
