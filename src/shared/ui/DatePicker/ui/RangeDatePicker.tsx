import { formatRange, isWithinBounds, parseRange } from '../lib/date';
import { useDateInput } from '../model/useDateInput';
import type { RangeDatePickerProps } from '../types';
import { Calendar } from './Calendar';
import { DateField } from './DateField';

export function RangeDatePicker({
  value,
  onChange,
  onInputValidationChange,
  mode,
  ...props
}: RangeDatePickerProps) {
  const input = useDateInput({
    value,
    format: formatRange,
    parse: parseRange,
    isAllowed: ({ from, to }) =>
      isWithinBounds(from, props.minDate, props.maxDate) &&
      isWithinBounds(to, props.minDate, props.maxDate),
    onChange,
    onInputValidationChange,
  });

  return (
    <DateField {...props} input={input} mode={mode}>
      {(close) => (
        <Calendar
          mode="range"
          value={value}
          minDate={props.minDate}
          maxDate={props.maxDate}
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
