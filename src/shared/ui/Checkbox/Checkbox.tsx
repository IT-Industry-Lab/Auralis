'use client';
import s from './Checkbox.module.scss';
import { useState } from 'react';
import { InputCircle } from '@/shared/ui/InputCircle/InputCircle';

export type CheckboxProps = {
  label?: string;
  value: string;
};

export const Checkbox = ({ label, value }: CheckboxProps) => {
  const [checked, setChecked] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const changeCheckedHandler = () => {
    setChecked(!checked);
  };
  return (
    <div className={s.checkboxWrapper}>
      <InputCircle>
        <input
          id={value}
          onChange={changeCheckedHandler}
          disabled={isDisabled}
          className={`${s.checkbox} ${checked ? s.checked : ''}`}
          type="checkbox"
          checked={checked}
          value={value}
        />
      </InputCircle>

      {label && (
        <label htmlFor={'checkboxId'} className={s.label}>
          {label}
        </label>
      )}
    </div>
  );
};
