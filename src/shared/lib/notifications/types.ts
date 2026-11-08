import type { AlertVariant } from '@/shared/ui/Alert';

export type NotifyOptions = {
  variant: AlertVariant;
  message: string;
  title?: string;
  durationSeconds?: number;
};

export type NotificationLabels = {
  container: string;
  close: string;
};
