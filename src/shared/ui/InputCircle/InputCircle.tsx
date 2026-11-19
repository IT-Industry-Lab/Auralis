import { ReactNode } from 'react';
import s from './InputCircle.module.css';

interface InputCircleProps {
  children: ReactNode;
}

export const InputCircle = ({ children }: InputCircleProps) => {
  return <div className={s.circle}>{children}</div>;
};
