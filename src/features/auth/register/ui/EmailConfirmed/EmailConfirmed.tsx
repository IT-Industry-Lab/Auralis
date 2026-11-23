import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/Button';
import emailConfirmedIllustration from './email-confirmed.svg';
import s from './EmailConfirmed.module.css';

export const EmailConfirmed = () => {
  return (
    <div className={s.container}>
      <h1 className={s.title}>Congratulations!</h1>
      <p className={s.description}>Your email has been confirmed</p>
      <Button asChild className={s.signInButton}>
        <Link href={ROUTES.signIn}>Sign In</Link>
      </Button>
      <Image
        src={emailConfirmedIllustration}
        alt="Email confirmed"
        width={432}
        height={300}
        className={s.illustration}
        priority
      />
    </div>
  );
};
