'use client';
import s from './Radio.module.scss';
import { useState } from 'react';
import { InputCircle } from '@/shared/ui/InputCircle/InputCircle';
export type RadioProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled: boolean;
};
const Radio = ({ label, name, onChange, checked, value, disabled }: RadioProps) => {
  const inputId = `${name}-${value}`;

  return (
    <div className={s.radioWrapper}>
      <InputCircle>
        <input
          id={inputId}
          className={s.radio}
          type="radio"
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
        />
      </InputCircle>

      <label htmlFor={inputId} className={s.label}>
        {label}
      </label>
    </div>
  );
};

export type RadioGroupProps = {
  radioGroup: Omit<RadioProps, 'onChange' | 'checked'>[];
  name: string;
};
export const RadioGroup = ({ radioGroup, name }: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const changeHandler = (value: string) => {
    setSelectedValue(value);
  };
  return (
    <fieldset name={name} className={s.radioGroup}>
      {radioGroup.map((radio) => (
        <Radio
          key={radio.value}
          name={radio.name}
          value={radio.value}
          checked={selectedValue === radio.value}
          onChange={() => changeHandler(radio.value)}
          label={radio.label}
          disabled={radio.disabled}
        />
      ))}
    </fieldset>
  );
};
