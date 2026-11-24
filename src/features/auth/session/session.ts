export const ACCESS_TOKEN_KEY = 'auralis.accessToken';

let memoryToken: string | null = null;
let memoryOnly = false;

function readAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  if (!memoryOnly) {
    try {
      memoryToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      // Storage can be unavailable even when the browser exposes localStorage.
    }
  }
  return memoryToken;
}

function writeAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  memoryToken = token;
  try {
    if (token === null) {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
}

export function storeAccessToken(token: string) {
  writeAccessToken(token);
}

async function validateAccessToken(token: string, signal: AbortSignal, apiBaseUrl: string) {
  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error',
    signal,
  });
  if (response.status === 401) return false;
  if (response.status !== 200) throw new Error('Session check failed');

  const user: unknown = await response.json();
  if (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    ((typeof user.id === 'number' && Number.isSafeInteger(user.id) && user.id > 0) ||
      (typeof user.id === 'string' && user.id.trim().length > 0))
  ) {
    return true;
  }
  throw new Error('Invalid session response');
}

export async function checkLoginSession(signal: AbortSignal, apiBaseUrl: string): Promise<boolean> {
  signal.throwIfAborted();
  let token = readAccessToken();
  if (!token) return false;
  const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(15000)]);

  while (token) {
    try {
      const authenticated = await validateAccessToken(token, requestSignal, apiBaseUrl);
      requestSignal.throwIfAborted();
      if (token === readAccessToken()) {
        if (!authenticated) writeAccessToken(null);
        return authenticated;
      }
    } catch (error) {
      if (requestSignal.aborted || token === readAccessToken()) throw error;
    }
    // A sign-in or logout in another tab may have replaced this request's token.
    token = readAccessToken();
  }
  return false;
}
