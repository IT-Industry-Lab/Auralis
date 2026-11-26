'use client';

import { useMutation } from '@tanstack/react-query';

import type { RegisterCredentials } from '../model/types';
import { BASE_URL } from './baseUrl';
import { getRegisterRecaptchaToken } from './recaptcha';
import { parseRegisterError, RegisterApiError } from './registerResponse';

export { RegisterApiError };
export type { RegisterCredentials } from '../model/types';
export type { RegisterFieldError } from './registerResponse';

const REGISTER_ENDPOINT = `${BASE_URL}/auth/register`;

const registerRequest = async (credentials: RegisterCredentials): Promise<void> => {
  const recaptchaToken = await getRegisterRecaptchaToken();
  const response = await fetch(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...credentials, recaptchaToken }),
  });

  if (!response.ok) {
    let payload: unknown = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    throw new RegisterApiError(parseRegisterError(payload, response.status));
  }
};

export const useRegister = () =>
  useMutation({
    mutationFn: registerRequest,
  });
