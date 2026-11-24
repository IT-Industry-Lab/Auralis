import { Suspense } from 'react';
import { VerifyEmailContent } from './VerifyEmailContent';
import s from './page.module.css';

export default function VerifyEmailPage() {
  return (
    <div className={s.page}>
      <Suspense fallback={<p className={s.loader}>Loading...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
