'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_API_BASE_URL } from './apiBaseUrl';
import { ACCESS_TOKEN_KEY, clearAccessToken, getAccessToken } from './session';

type Me = {
  id: string;
  name: string;
  email: string;
};

const AUTH_ME_QUERY_KEY = ['auth', 'me'];

async function getCurrentUser(signal: AbortSignal): Promise<Me | null> {
  const token = getAccessToken();
  if (!token) return null;

  const response = await fetch(`${AUTH_API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error',
    signal,
  });

  if (response.status === 401) {
    clearAccessToken();
    return null;
  }
  if (!response.ok) throw new Error('Could not load the current user.');

  const user: unknown = await response.json();
  if (typeof user !== 'object' || user === null || !('id' in user)) {
    throw new Error('Invalid user response.');
  }

  const id = user.id;
  const name = 'name' in user ? user.name : 'username' in user ? user.username : undefined;
  const email = 'email' in user ? user.email : undefined;
  if (
    (typeof id !== 'string' && typeof id !== 'number') ||
    typeof email !== 'string' ||
    (name !== undefined && typeof name !== 'string')
  ) {
    throw new Error('Invalid user response.');
  }

  return { id: String(id), name: name ?? '', email };
}

export const useGetMeQuery = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: ({ signal }) => getCurrentUser(signal),
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === ACCESS_TOKEN_KEY || event.key === null) {
        void queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      }
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [queryClient]);

  return query;
};
