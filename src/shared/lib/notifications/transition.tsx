import { useLayoutEffect } from 'react';
import { cssTransition, toast, type ToastTransitionProps } from 'react-toastify/unstyled';

import styles from './Notifications.module.css';

const Fade = cssTransition({ enter: styles.enter, exit: styles.exit, collapse: false });

export function createNotificationTransition(id: string) {
  // A fresh transition remounts the DOM even when replacing an exiting toast.
  // Its old exit callback refers to the old toast id and cannot remove the replacement.
  return function NotificationTransition(props: ToastTransitionProps) {
    useLayoutEffect(() => {
      toast.pause({ id });
    }, []);

    return (
      <Fade
        {...props}
        playToast={() => {
          if (document.hasFocus()) props.playToast();
          else toast.pause({ id });
        }}
      />
    );
  };
}
