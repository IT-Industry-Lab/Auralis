import { formatDate, isWithinBounds, parseDate } from '../lib/date';
import { useDateInput } from '../model/useDateInput';
import type { SingleDatePickerProps } from '../types';
import { Calendar } from './Calendar';
import { DateField } from './DateField';

export function SingleDatePicker({
  value,
  onChange,
  onInputValidationChange,
  minDate,
  maxDate,
  mode,
  ...props
}: SingleDatePickerProps) {
  const input = useDateInput({
    value,
    format: formatDate,
    parse: parseDate,
    isAllowed: (date) => isWithinBounds(date, minDate, maxDate),
    onChange,
    onInputValidationChange,
  });

  return (
    <DateField {...props} input={input} mode={mode ?? 'single'}>
      {(close) => (
        <Calendar
          mode="single"
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          labels={props.labels}
          onChange={(date) => {
            input.select(date);
            close();
          }}
        />
      )}
    </DateField>
  );
}
