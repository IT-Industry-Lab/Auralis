'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@/shared/constants';
import { Button } from '@/shared/ui/Button';
import { SelectBox, type SelectBoxOption } from '@/shared/ui/SelectBox';

import styles from './Header.module.css';

export type HeaderProps = {
  isAuthenticated: boolean;
  languageOptions: readonly SelectBoxOption[];
  languageValue: string;
  onLanguageChange: (value: string) => void;
  onNotificationsClick: () => void;
};

export function Header({
  isAuthenticated,
  languageOptions,
  languageValue,
  onLanguageChange,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.logo} href={ROUTES.feed} aria-label="Inctagram home">
          <Image src="/icons/header/logo.svg" alt="Inctagram" width={128} height={36} />
        </Link>

        <div className={styles.actions}>
          {isAuthenticated && (
            // Temporary placeholder: delegates clicks to the parent; no notification logic is implemented.
            <button
              className={styles.notifications}
              type="button"
              aria-label="Notifications"
              onClick={onNotificationsClick}
            >
              <Image src="/icons/header/notification-bell.svg" alt="" width={24} height={24} />
            </button>
          )}

          <div className={styles.language}>
            <SelectBox
              aria-label="Interface language"
              options={languageOptions}
              value={languageValue}
              onValueChange={onLanguageChange}
            />
          </div>

          {!isAuthenticated && (
            <nav className={styles['auth-links']} aria-label="Authentication">
              <Button asChild variant="text">
                <Link href={ROUTES.signIn}>Log in</Link>
              </Button>
              <Button asChild variant="primary">
                <Link href="/register">Sign up</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
