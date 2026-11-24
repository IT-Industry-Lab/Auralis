import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { afterEach, beforeEach, test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('./session.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext },
});
const { ACCESS_TOKEN_KEY, storeAccessToken, checkLoginSession } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const apiBaseUrl = 'https://api.example.test/api/v1';
const storage = new Map();
const checkSession = (signal = new AbortController().signal) =>
  checkLoginSession(signal, apiBaseUrl);

beforeEach(() => {
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  };
  storage.clear();
});

afterEach(() => {
  delete globalThis.window;
});

test('a guest can open sign-in without an API request', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => assert.fail('unexpected API request'));
  assert.equal(await checkSession(), false);
  assert.equal(fetch.mock.callCount(), 0);
});

test('a token persisted by a previous visit is checked against the profile endpoint', async (t) => {
  storage.set(ACCESS_TOKEN_KEY, 'persisted-token');
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 9 }));
  assert.equal(await checkSession(), true);
  const [url, options] = fetch.mock.calls[0].arguments;
  assert.equal(url, `${apiBaseUrl}/auth/me`);
  assert.equal(options.headers.Authorization, 'Bearer persisted-token');
  assert.equal(options.method, 'GET');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.redirect, 'error');
  assert.equal(options.credentials, 'omit');
});

test('an expired or revoked token is removed on 401', async (t) => {
  storeAccessToken('expired-token');
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 401 }));
  assert.equal(await checkSession(), false);
  assert.equal(storage.has(ACCESS_TOKEN_KEY), false);
});

test('an unavailable or malformed profile response preserves the token for retry', async (t) => {
  storeAccessToken('valid-token');
  for (const result of [
    () => Promise.reject(new TypeError('Network error')),
    () => new Response(null, { status: 503 }),
    () => new Response('<html>'),
    () => Response.json({}),
  ]) {
    const fetch = t.mock.method(globalThis, 'fetch', result);
    await assert.rejects(checkSession());
    assert.equal(storage.get(ACCESS_TOKEN_KEY), 'valid-token');
    fetch.mock.restore();
  }
});

test('a late 401 for an old token checks the token written by another tab', async (t) => {
  storeAccessToken('old-token');
  const fetch = t.mock.method(globalThis, 'fetch', async (_, options) => {
    if (options.headers.Authorization === 'Bearer old-token') {
      storage.set(ACCESS_TOKEN_KEY, 'new-token');
      return new Response(null, { status: 401 });
    }
    assert.equal(options.headers.Authorization, 'Bearer new-token');
    return Response.json({ id: 9 });
  });
  assert.equal(await checkSession(), true);
  assert.equal(fetch.mock.callCount(), 2);
  assert.equal(storage.get(ACCESS_TOKEN_KEY), 'new-token');
});

test('a token removed during a session check prevents a stale redirect', async (t) => {
  storeAccessToken('previous-token');
  t.mock.method(globalThis, 'fetch', async () => {
    storage.delete(ACCESS_TOKEN_KEY);
    return Response.json({ id: 9 });
  });
  assert.equal(await checkSession(), false);
});

test('aborting a session check preserves the token', async (t) => {
  storeAccessToken('active-token');
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (_, { signal }) => {
    controller.abort();
    signal.throwIfAborted();
  });
  await assert.rejects(checkSession(controller.signal), { name: 'AbortError' });
  assert.equal(storage.get(ACCESS_TOKEN_KEY), 'active-token');
});

test('the active tab can verify its token when storage writes are blocked', async (t) => {
  t.mock.method(window.localStorage, 'setItem', () => {
    throw new Error('Storage unavailable');
  });
  storeAccessToken('memory-token');
  const fetch = t.mock.method(globalThis, 'fetch', async (_, options) => {
    assert.equal(options.headers.Authorization, 'Bearer memory-token');
    return Response.json({ id: 9 });
  });
  assert.equal(await checkSession(), true);
  fetch.mock.mockImplementation(async () => new Response(null, { status: 401 }));
  assert.equal(await checkSession(), false);
  assert.equal(await checkSession(), false);
  assert.equal(fetch.mock.callCount(), 2);
});
