import type { ComponentProps } from 'react';

export type InputProps = Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange'> & {
  value: string;
  onChange: NonNullable<ComponentProps<'input'>['onChange']>;
  label?: string;
  error?: string;
  fullWidth?: boolean;
};
