import { AUTH_API_BASE_URL } from '../../session/apiBaseUrl';

export async function logoutRequest(): Promise<void> {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
    });

    // No valid refresh cookie means there is no refresh session left to revoke.
    if (response.status === 401) return;

    if (!response.ok) {
      throw new Error('Could not log out. Please try again.');
    }
  } catch {
    throw new Error('Could not log out. Please try again.');
  }
}
