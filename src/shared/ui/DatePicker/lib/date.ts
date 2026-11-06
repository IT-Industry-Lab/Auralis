import type { DateRange } from '../types';

export function formatDate(value: Date | null): string {
  if (!value) return '';

  return [
    String(value.getDate()).padStart(2, '0'),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getFullYear()).padStart(4, '0'),
  ].join('/');
}

export function parseDate(text: string): Date | null {
  const match = /^(\d{2})([/.])(\d{2})\2(\d{4})$/.exec(text.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[3]) - 1;
  const year = Number(match[4]);
  if (year < 1) return null;

  // setFullYear preserves years 1–99, unlike the numeric Date constructor.
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month, day);

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? date
    : null;
}

export function formatRange(value: DateRange | null): string {
  return value ? `${formatDate(value.from)} - ${formatDate(value.to)}` : '';
}

export function parseRange(text: string): DateRange | null {
  const parts = text.trim().split(/\s*[-–]\s*/);
  if (parts.length !== 2) return null;

  const from = parseDate(parts[0]);
  const to = parseDate(parts[1]);
  return from && to && from <= to ? { from, to } : null;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function isWithinBounds(date: Date, minDate?: Date, maxDate?: Date): boolean {
  const day = startOfDay(date);
  return (!minDate || day >= startOfDay(minDate)) && (!maxDate || day <= startOfDay(maxDate));
}

export function clampDate(date: Date, minDate?: Date, maxDate?: Date): Date {
  const day = startOfDay(date);
  if (minDate && day < startOfDay(minDate)) return minDate;
  if (maxDate && day > startOfDay(maxDate)) return maxDate;
  return date;
}
