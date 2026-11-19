'use client';

import { type ChangeEvent, CSSProperties, type ReactNode, useId } from 'react';
import s from './Checkbox.module.css';

export type CheckboxProps = {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string[];
  style?: CSSProperties;
};

export const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  style,
}: CheckboxProps) => {
  const id = useId();

  const changeCheckedHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className={`${s.checkboxWrapper} `} style={style}>
      <div className={s.circle}>
        <input
          id={id}
          onChange={changeCheckedHandler}
          disabled={disabled}
          className={`${s.checkbox} ${checked ? s.checked : ''}`}
          type="checkbox"
          checked={checked}
        />
      </div>

      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
    </div>
  );
};
