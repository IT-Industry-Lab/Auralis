import { AUTH_API_BASE_URL } from '../../session/apiBaseUrl';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

type LoginErrorCode =
  'invalid-credentials' | 'unverified-email' | 'invalid-request' | 'unavailable' | 'network-error';

export class LoginError extends Error {
  readonly code: LoginErrorCode;

  constructor(code: LoginErrorCode) {
    super(code);
    this.name = 'LoginError';
    this.code = code;
  }
}

export const authApiBaseUrl = AUTH_API_BASE_URL;

export async function requestLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${authApiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new LoginError('network-error');
  }

  switch (response.status) {
    case 200: {
      const data: unknown = await response.json().catch(() => null);
      if (
        data &&
        typeof data === 'object' &&
        'accessToken' in data &&
        typeof data.accessToken === 'string' &&
        data.accessToken.trim()
      ) {
        return { accessToken: data.accessToken };
      }
      throw new LoginError('unavailable');
    }
    case 400:
      throw new LoginError('invalid-request');
    case 401:
      throw new LoginError('invalid-credentials');
    case 403:
      throw new LoginError('unverified-email');
    default:
      throw new LoginError('unavailable');
  }
}
