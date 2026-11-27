import { useCallback, useState } from 'react';

import type { DatePickerInputState } from '../types';

type Options<Value> = {
  value: Value | null;
  format: (value: Value | null) => string;
  parse: (text: string) => Value | null;
  isAllowed: (value: Value) => boolean;
  onChange: (value: Value | null) => void;
  onInputValidationChange?: (state: DatePickerInputState) => void;
};

export function useDateInput<Value>({
  value,
  format,
  parse,
  isAllowed,
  onChange,
  onInputValidationChange,
}: Options<Value>) {
  const formatted = format(value);
  const [draft, setDraft] = useState<{ source: string; text: string } | null>(null);
  // Keep the echo of our own onChange, but discard a draft superseded by the parent.
  if (draft && draft.source !== formatted) setDraft(null);
  const text = draft?.source === formatted ? draft.text : formatted;
  const resetDraft = useCallback(() => setDraft(null), []);

  function changeText(nextText: string) {
    const parsed = parse(nextText);
    const nextValue = parsed && isAllowed(parsed) ? parsed : null;
    setDraft({ source: format(nextValue), text: nextText });
    onInputValidationChange?.({
      text: nextText,
      status: !nextText.trim() ? 'empty' : nextValue ? 'valid' : 'invalid',
    });
    onChange(nextValue);
  }

  function select(nextValue: Value) {
    setDraft(null);
    onInputValidationChange?.({ text: format(nextValue), status: 'valid' });
    onChange(nextValue);
  }

  return { text, changeText, select, resetDraft };
}
