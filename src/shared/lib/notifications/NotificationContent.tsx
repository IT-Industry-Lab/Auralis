import { createContext, useContext } from 'react';
import type { ToastContentProps } from 'react-toastify/unstyled';

import { Alert } from '@/shared/ui/Alert';

import type { NotificationLabels, NotifyOptions } from './types';

export const NotificationLabelContext = createContext<NotificationLabels | null>(null);

export function NotificationContent({ data, closeToast }: ToastContentProps<NotifyOptions>) {
  const labels = useContext(NotificationLabelContext);

  if (!labels) throw new Error('NotificationContent requires NotificationsContainer.');

  return (
    <Alert
      variant={data.variant}
      title={data.title}
      message={data.message}
      closeLabel={labels.close}
      onClose={() => closeToast(true)}
    />
  );
}
