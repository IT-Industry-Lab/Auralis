import { RegisterForm } from '@/features/auth';
import s from './RegisterPage.module.css';

export default function RegisterPage() {
  return (
    <div className={s.page}>
      <RegisterForm />
    </div>
  );
}
