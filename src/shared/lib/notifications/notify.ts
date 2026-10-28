'use client';

import { createElement } from 'react';
import { toast, type ToastContentProps, type ToastOptions } from 'react-toastify/unstyled';

import { NotificationContent } from './NotificationContent';
import { createNotificationTransition } from './transition';
import type { NotifyOptions } from './types';

let sequence = 0;
let previousId: string | undefined;

// Toastify also evaluates render callbacks outside React when producing change events.
const renderNotification = (props: ToastContentProps<NotifyOptions>) =>
  createElement(NotificationContent, props);

export function notify(data: NotifyOptions): void {
  const seconds = data.durationSeconds ?? 5;
  const milliseconds = seconds * 1000;
  const autoClose =
    Number.isFinite(milliseconds) && milliseconds >= 1 && milliseconds <= 2_147_483_647
      ? milliseconds
      : 5000;
  const toastId = `auralis-notification-${++sequence}`;
  const options: ToastOptions<NotifyOptions> = {
    toastId,
    data,
    autoClose,
    type: data.variant,
    role: data.variant === 'error' ? 'alert' : 'status',
    transition: createNotificationTransition(toastId),
  };

  if (previousId) {
    // null removes Toastify's default update delay, so consecutive calls stay ordered.
    toast.update(previousId, { ...options, render: renderNotification, delay: null });
    // Also replaces a call queued before the container mounts. After an update the old id is gone.
    toast.dismiss(previousId);
  }

  // Toastify ignores this duplicate when update succeeded; otherwise this creates the toast.
  toast(renderNotification, options);
  previousId = toastId;
}
