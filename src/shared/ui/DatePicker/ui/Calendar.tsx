import { DayPicker, type ChevronProps, type DateRange as PendingRange } from '@daypicker/react';
import Image from 'next/image';
import { useState } from 'react';

import { clampDate, formatRange, startOfDay } from '../lib/date';
import type { DatePickerBaseProps, DateRange } from '../types';
import styles from './Calendar.module.css';

type CommonProps = Pick<DatePickerBaseProps, 'minDate' | 'maxDate' | 'labels'>;
type CalendarProps = CommonProps &
  (
    | { mode: 'single'; value: Date | null; onChange: (date: Date) => void }
    | { mode: 'range'; value: DateRange | null; onChange: (range: DateRange) => void }
  );

function Chevron({ orientation }: ChevronProps) {
  return (
    <Image
      src="/icons/date-picker/chevron.svg"
      width={20}
      height={20}
      alt=""
      className={orientation === 'right' ? styles['right-chevron'] : undefined}
    />
  );
}

const classNames = {
  root: styles.root,
  month: styles.month,
  month_caption: styles.caption,
  caption_label: styles['caption-label'],
  nav: styles.nav,
  button_previous: styles['nav-button'],
  button_next: styles['nav-button'],
  month_grid: styles.grid,
  weekday: styles.weekday,
  day: styles.day,
  day_button: styles['day-button'],
  today: styles.today,
  outside: styles.outside,
  disabled: styles.disabled,
  selected: styles.selected,
  range_start: styles['range-start'],
  range_middle: styles['range-middle'],
  range_end: styles['range-end'],
  hidden: styles.hidden,
};

export function Calendar(props: CalendarProps) {
  const source = props.mode === 'range' ? formatRange(props.value) : '';
  const [pending, setPending] = useState<{ source: string; range: PendingRange }>();
  if (pending && pending.source !== source) setPending(undefined);
  const selectedDate = props.mode === 'single' ? props.value : props.value?.from;
  const disabled = [
    ...(props.minDate ? [{ before: startOfDay(props.minDate) }] : []),
    ...(props.maxDate ? [{ after: startOfDay(props.maxDate) }] : []),
  ];
  const options = {
    autoFocus: true,
    showOutsideDays: true,
    fixedWeeks: true,
    weekStartsOn: 1 as const,
    navLayout: 'after' as const,
    defaultMonth: clampDate(selectedDate ?? new Date(), props.minDate, props.maxDate),
    startMonth: props.minDate,
    endMonth: props.maxDate,
    disabled,
    classNames,
    components: { Chevron },
    modifiers: { weekend: { dayOfWeek: [0, 6] } },
    modifiersClassNames: { weekend: styles.weekend },
    formatters: {
      formatWeekdayName: (date: Date) =>
        date.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2),
    },
    labels: {
      labelPrevious: () => props.labels?.previousMonth ?? 'Go to previous month',
      labelNext: () => props.labels?.nextMonth ?? 'Go to next month',
    },
  };

  if (props.mode === 'single') {
    return (
      <DayPicker
        {...options}
        mode="single"
        required
        selected={props.value ?? undefined}
        onSelect={props.onChange}
      />
    );
  }

  return (
    <DayPicker
      {...options}
      mode="range"
      required
      selected={pending?.source === source ? pending.range : (props.value ?? undefined)}
      onSelect={(range, day) => {
        if (!pending) {
          setPending({ source, range: { from: day, to: undefined } });
        } else if (range.from && range.to) {
          props.onChange({ from: range.from, to: range.to });
        }
      }}
    />
  );
}
