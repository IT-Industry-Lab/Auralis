import type { ComponentProps, ReactNode } from 'react';
import type { ButtonVariant } from '@/shared/ui/Button/type';
import s from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
} & ComponentProps<'button'>;

export const Button = ({
  children,
  variant = 'primary',
  fullWidth,
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  const buttonClassName = [s.button, s[variant], fullWidth ? s['full-width'] : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} {...props} className={buttonClassName}>
      {children}
    </button>
  );
};
