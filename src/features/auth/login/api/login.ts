'use client';

import { useState, useCallback } from 'react';

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

const MOCK_LOGIN_RESPONSE: LoginResponse = {
  token: 'mock-jwt-token',
  user: {
    id: 'mock-user-1',
    name: 'Test User',
    email: 'test@example.com',
  },
};

type UseLoginResultData = {
  data: LoginResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
};


export const useLogin = (): UseLoginResultData => {
  const [data, setData] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result: LoginResponse = MOCK_LOGIN_RESPONSE;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, login };
};
