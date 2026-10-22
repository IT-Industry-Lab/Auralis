'use client';
import s from './Checkbox.module.scss';
import { useState } from 'react';

export type CheckboxProps = {
  label?: string;
};

export const Checkbox = ({ label }: CheckboxProps) => {
  const [checked, setChecked] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const changeCheckedHandler = () => {
    setChecked(!checked);
  };
  return (
    <div className={s.checkboxWrapper}>
      <div className={s.circle}>
        <input
          id={'checkboxId'}
          onChange={changeCheckedHandler}
          disabled={isDisabled}
          className={`${s.checkbox} ${checked ? s.checked : ''}`}
          type="checkbox"
          checked={checked}
        />
      </div>

      {label && (
        <label htmlFor={'checkboxId'} className={s.label}>
          {label}
        </label>
      )}
    </div>
  );
};
