import { RECAPTCHA_SITE_KEY } from '../config/recaptcha';

type RecaptchaV3 = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaV3;
  }
}

export function getRegisterRecaptchaToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const recaptcha = window.grecaptcha;
    if (!recaptcha) {
      reject(new Error('reCAPTCHA is not loaded. Please try again.'));
      return;
    }

    recaptcha.ready(() => {
      void recaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' }).then((token) => {
        if (!token.trim()) {
          reject(new Error('Could not verify this request. Please try again.'));
          return;
        }
        resolve(token);
      }, reject);
    });
  });
}
