'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  EmailConfirmed,
  VerificationLinkExpired,
  getRegisterBaseUrl,
} from '@/features/auth/register';
import s from './page.module.css';

type VerifyEmailResponse = {
  verified: boolean;
};

const verifyEmailRequest = async (token: string): Promise<VerifyEmailResponse> => {
  const url = `${getRegisterBaseUrl()}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      let responseBody = '';

      try {
        responseBody = await response.text();
      } catch {
        return { verified: true };
      }

      if (!responseBody) {
        return { verified: true };
      }

      try {
        const parsed: unknown = JSON.parse(responseBody);

        if (parsed && typeof parsed === 'object') {
          return parsed as VerifyEmailResponse;
        }

        return { verified: true };
      } catch {
        return { verified: true };
      }
    }

    let responseBody = '';

    try {
      responseBody = await response.text();
    } catch (readError) {
      responseBody = `Failed to read response body: ${String(readError)}`;
    }

    console.error('Email verification request failed', {
      status: response.status,
      statusText: response.statusText,
      body: responseBody,
      url,
    });

    throw new Error('Invalid or expired verification token');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid or expired verification token') {
      throw error;
    }

    console.error('Email verification request error', {
      error,
      url,
    });
    throw error;
  }
};

export const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => verifyEmailRequest(token as string),
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) {
    return <VerificationLinkExpired />;
  }

  if (isSuccess && data) {
    return <EmailConfirmed />;
  }

  if (isError) {
    return <VerificationLinkExpired />;
  }

  return <p className={s.loader}>Loading...</p>;
};
