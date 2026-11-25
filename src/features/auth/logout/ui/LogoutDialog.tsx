'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/Button';
import { useLogout } from '../model/useLogout';
import styles from './LogoutDialog.module.css';

type LogoutDialogProps = {
  email: string;
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutDialog({ email, isOpen, onClose }: LogoutDialogProps) {
  return <LogoutDialogContent email={email} isOpen={isOpen} onClose={onClose} />;
}

function LogoutDialogContent({ email, isOpen, onClose }: LogoutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logoutMutation = useLogout(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="logout-dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        if (logoutMutation.isPending) {
          event.preventDefault();
        }
      }}
    >
      <div className={styles.header}>
        <h2 id="logout-dialog-title">Log Out</h2>

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          disabled={logoutMutation.isPending}
          aria-label="Close dialog"
        >
          ×
        </button>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>
          Are you sure you want to log out of your account
          <br />
          <strong>&quot;{email}&quot;?</strong>
        </p>

        {logoutMutation.isError && (
          <p className={styles.error} role="alert">
            {logoutMutation.error.message}
          </p>
        )}

        <div className={styles.actions}>
          <Button
            variant="outline"
            className={styles['action-button']}
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? '...' : 'Yes'}
          </Button>

          <Button
            variant="primary"
            className={styles['action-button']}
            onClick={onClose}
            disabled={logoutMutation.isPending}
          >
            No
          </Button>
        </div>
      </div>
    </dialog>
  );
}
