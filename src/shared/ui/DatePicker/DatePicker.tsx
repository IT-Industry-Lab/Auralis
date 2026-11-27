'use client';

import type { DatePickerProps } from './types';
import { RangeDatePicker } from './ui/RangeDatePicker';
import { SingleDatePicker } from './ui/SingleDatePicker';

export function DatePicker(props: DatePickerProps) {
  return props.mode === 'range' ? <RangeDatePicker {...props} /> : <SingleDatePicker {...props} />;
}
