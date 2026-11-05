'use client';

import { useLayoutEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify/unstyled';

import { NotificationLabelContext } from './NotificationContent';
import styles from './Notifications.module.css';
import type { NotificationLabels } from './types';

export function NotificationsContainer({ labels }: { labels: NotificationLabels }) {
  const host = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Toastify 11.1 hardcodes an outer polite region. Keep only each toast's
    // status/alert live region, so errors and successes are not announced twice.
    host.current?.querySelector('section')?.removeAttribute('aria-live');
  }, []);

  return (
    <NotificationLabelContext value={labels}>
      <div ref={host}>
        <ToastContainer
          aria-label={labels.container}
          position="bottom-left"
          className={() => styles.container}
          toastClassName={() => styles.toast}
          progressClassName={() => styles.timer}
          closeButton={false}
          icon={false}
          hideProgressBar
          closeOnClick={false}
          draggable={false}
          pauseOnHover
          pauseOnFocusLoss
          hotKeys={() => false}
        />
      </div>
    </NotificationLabelContext>
  );
}
