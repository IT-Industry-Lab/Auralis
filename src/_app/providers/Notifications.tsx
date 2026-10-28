'use client';

import dynamic from 'next/dynamic';

const NotificationsContainer = dynamic(
  () => import('@/shared/lib/notifications').then((module) => module.NotificationsContainer),
  { ssr: false }
);

export function Notifications() {
  return (
    <NotificationsContainer labels={{ container: 'Notifications', close: 'Close notification' }} />
  );
}
