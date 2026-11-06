import { useState, useEffect } from 'react';

type Me = {
  id: string;
  name: string;
  email: string;
};

type UseGetMeQueryResult = {
  data: Me | null;
  isLoading: boolean;
  isSuccess: boolean;
};

const MOCK_USER: Me = {
  id: 'mock-user-1',
  name: 'Test User',
  email: 'test@example.com',
};

export const useGetMeQuery = (): UseGetMeQueryResult => {
  const [data, setData] = useState<Me | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    setData(MOCK_USER);
  }, []);


  return { data, isLoading, isSuccess: !isLoading };
}