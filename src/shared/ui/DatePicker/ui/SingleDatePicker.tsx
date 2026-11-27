import { formatDate, isWithinBounds, parseDate } from '../lib/date';
import { useDateInput } from '../model/useDateInput';
import type { SingleDatePickerProps } from '../types';
import { Calendar } from './Calendar';
import { DateField } from './DateField';

export function SingleDatePicker({
  value,
  onChange,
  onInputValidationChange,
  mode,
  ...props
}: SingleDatePickerProps) {
  const input = useDateInput({
    value,
    format: formatDate,
    parse: parseDate,
    isAllowed: (date) => isWithinBounds(date, props.minDate, props.maxDate),
    onChange,
    onInputValidationChange,
  });

  return (
    <DateField {...props} input={input} mode={mode ?? 'single'}>
      {(close) => (
        <Calendar
          mode="single"
          value={value}
          minDate={props.minDate}
          maxDate={props.maxDate}
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
