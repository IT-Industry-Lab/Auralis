import Image from 'next/image';

import styles from './Alert.module.css';

export type AlertVariant = 'success' | 'error';

export type AlertProps = {
  variant: AlertVariant;
  message: string;
  title?: string;
  closeLabel: string;
  onClose: () => void;
};

export function Alert({ variant, message, title, closeLabel, onClose }: AlertProps) {
  const text = title ? `${title} ${message}` : message;

  return (
    <div className={`${styles.alert} ${styles[variant]}`}>
      <p className={styles.text} title={text}>
        {title && <strong className={styles.title}>{title} </strong>}
        {message}
      </p>
      <button type="button" className={styles.close} aria-label={closeLabel} onClick={onClose}>
        <Image src="/icons/close.svg" alt="" width={24} height={24} />
      </button>
    </div>
  );
}
