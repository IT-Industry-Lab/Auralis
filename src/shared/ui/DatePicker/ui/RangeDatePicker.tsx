import { formatRange, isWithinBounds, parseRange } from '../lib/date';
import { useDateInput } from '../model/useDateInput';
import type { RangeDatePickerProps } from '../types';
import { Calendar } from './Calendar';
import { DateField } from './DateField';

export function RangeDatePicker({
  value,
  onChange,
  onInputValidationChange,
  minDate,
  maxDate,
  mode,
  ...props
}: RangeDatePickerProps) {
  const input = useDateInput({
    value,
    format: formatRange,
    parse: parseRange,
    isAllowed: ({ from, to }) =>
      isWithinBounds(from, minDate, maxDate) && isWithinBounds(to, minDate, maxDate),
    onChange,
    onInputValidationChange,
  });

  return (
    <DateField {...props} input={input} mode={mode}>
      {(close) => (
        <Calendar
          mode="range"
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          labels={props.labels}
          onChange={(range) => {
            input.select(range);
            close();
          }}
        />
      )}
    </DateField>
  );
}
