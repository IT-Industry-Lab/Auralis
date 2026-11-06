'use client';

import { useState, useCallback } from 'react';

type LogoutResponse = boolean;

type UseLogoutResultData = {
  data: LogoutResponse | null;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
};


export const useLogout = (): UseLogoutResultData => {
  const [data, setData] = useState<LogoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result: LogoutResponse = true;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, logout };
};
