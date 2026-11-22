'use client';

import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import {
  requestLogin,
  type LoginCredentials,
  type LoginError,
  type LoginResponse,
} from './requestLogin';

export function useLogin() {
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
    onSettled: () => {
      submitting.current = false;
    },
  });

  function login(credentials: LoginCredentials) {
    // Two submits can happen before React renders the disabled button.
    if (submitting.current) return;
    submitting.current = true;
    mutate(credentials);
  }

  return { login, data, error, isPending, isSuccess, reset };
}
