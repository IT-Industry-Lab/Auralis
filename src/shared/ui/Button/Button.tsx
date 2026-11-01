import type { ComponentProps, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { ButtonVariant } from '@/shared/ui/Button/type';
import styles from './Button.module.css';

type ButtonProps = {
  asChild?: boolean;
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
} & ComponentProps<'button'>;

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  asChild = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : 'button';
  const buttonClassName = [
    styles.button,
    styles[variant],
    fullWidth && styles['full-width'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component {...props} type={type} className={buttonClassName}>
      {children}
    </Component>
  );
};
