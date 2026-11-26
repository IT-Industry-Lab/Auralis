'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { storeAccessToken } from '../../session/session';
import {
  requestLogin,
  type LoginCredentials,
  type LoginError,
  type LoginResponse,
} from './requestLogin';

export function useLogin() {
  const queryClient = useQueryClient();
  const submitting = useRef(false);
  const { mutate, data, error, isPending, isSuccess, reset } = useMutation<
    LoginResponse,
    LoginError,
    LoginCredentials
  >({
    mutationFn: requestLogin,
    gcTime: 0,
    retry: false,
    networkMode: 'always',
    onSuccess: async ({ accessToken }) => {
      storeAccessToken(accessToken);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onSettled: () => {
      submitting.current = false;
    },
  });

  function login(credentials: LoginCredentials, onSuccess?: () => void) {
    // Two submits can happen before React renders the disabled button.
    if (submitting.current) return;
    submitting.current = true;
    mutate(credentials, { onSuccess });
  }

  return { login, data, error, isPending, isSuccess, reset };
}
