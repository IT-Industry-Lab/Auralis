'use client';

import { useCallback, useState } from 'react';
import type { RegisterFormData } from '../model/types';

export type RegisterCredentials = Omit<RegisterFormData, 'passwordConfirmation' | 'agreeToTerms'>;

export type RegisterFieldError = {
  field: 'username' | 'email';
  message: string;
};

type RegisterResult =
  { ok: true } | { ok: false; fieldError?: RegisterFieldError; message: string };

type UseRegisterResultData = {
  isLoading: boolean;
  error: string | null;
  register: (credentials: RegisterCredentials) => Promise<RegisterResult>;
};

const TAKEN_EMAIL = 'taken@example.com';
const TAKEN_USERNAME = 'taken_user';

export const useRegister = (): UseRegisterResultData => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<RegisterResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (credentials.email.toLowerCase() === TAKEN_EMAIL) {
          const message = 'User with this email is already registered';
          setError(message);
          return {
            ok: false,
            fieldError: { field: 'email', message },
            message,
          };
        }

        if (credentials.username.toLowerCase() === TAKEN_USERNAME) {
          const message = 'User with this username is already registered';
          setError(message);
          return {
            ok: false,
            fieldError: { field: 'username', message },
            message,
          };
        }

        return { ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(message);
        return { ok: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, error, register };
};
