import type { ComponentPropsWithRef, ReactNode } from 'react';

export type DateRange = { from: Date; to: Date };

export type DatePickerInputState = {
  text: string;
  status: 'empty' | 'valid' | 'invalid';
};

export type DatePickerLabels = {
  openCalendar: string;
  calendar: string;
  previousMonth: string;
  nextMonth: string;
};

export type DatePickerBaseProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'min' | 'max'
> & {
  label?: string;
  error?: ReactNode;
  minDate?: Date;
  maxDate?: Date;
  labels?: Partial<DatePickerLabels>;
  onBlur?: () => void;
  onInputValidationChange?: (state: DatePickerInputState) => void;
};

export type SingleDatePickerProps = DatePickerBaseProps & {
  mode?: 'single';
  value: Date | null;
  onChange: (value: Date | null) => void;
};

export type RangeDatePickerProps = DatePickerBaseProps & {
  mode: 'range';
  value: DateRange | null;
  onChange: (value: DateRange | null) => void;
};

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;
