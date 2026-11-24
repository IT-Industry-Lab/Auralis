'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/Button';
import s from './EmailSentModal.module.css';

type EmailSentModalProps = {
  isOpen: boolean;
  email: string;
  onClose: () => void;
};

export const EmailSentModal = ({ isOpen, email, onClose }: EmailSentModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={s.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h2 className={s.title}>Email sent</h2>
          <button
            type="button"
            className={s.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <Image src="/icons/close.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <div className={s.body}>
          <p className={s.text}>We have sent a link to confirm your email to {email}</p>
          <div className={s.actions}>
            <Button type="button" onClick={onClose} className={s.okButton}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
