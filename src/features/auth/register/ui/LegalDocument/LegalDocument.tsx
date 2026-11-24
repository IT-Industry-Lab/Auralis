import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';
import s from './LegalDocument.module.css';

type LegalDocumentProps = {
  title: string;
  content: string;
};

export const LegalDocument = ({ title, content }: LegalDocumentProps) => {
  return (
    <div className={s.wrapper}>
      <Link href={ROUTES.register} className={s.backLink}>
        ← Back to Sign Up
      </Link>

      <h1 className={s.title}>{title}</h1>

      <p className={s.content}>{content}</p>
    </div>
  );
};
