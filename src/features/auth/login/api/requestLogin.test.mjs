import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('./requestLogin.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext },
});
const { requestLogin, LoginError } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const credentials = { email: 'tester@example.test', password: 'fixture-password' };

function matchesLoginError(code) {
  return (error) => error instanceof LoginError && error.code === code;
}

test('login posts JSON to the configured endpoint with cookie support', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ accessToken: 'fixture-access-token' })
  );

  assert.deepEqual(await requestLogin(credentials), {
    accessToken: 'fixture-access-token',
  });
  assert.equal(fetch.mock.callCount(), 1);
  const [url, init] = fetch.mock.calls[0].arguments;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://auralis-online.ru/api/v1';
  assert.equal(String(url), `${apiBaseUrl.replace(/\/$/, '')}/auth/login`);
  assert.equal(init.method, 'POST');
  assert.equal(new Headers(init.headers).get('content-type'), 'application/json');
  assert.deepEqual(JSON.parse(init.body), credentials);
  assert.equal(init.credentials, 'include');
  assert.equal(init.cache, 'no-store');
  assert.equal(init.redirect, 'error');
});

for (const [httpStatus, code] of [
  [400, 'invalid-request'],
  [401, 'invalid-credentials'],
  [403, 'unverified-email'],
  [500, 'unavailable'],
]) {
  test(`login maps HTTP ${httpStatus} to ${code}`, async (t) => {
    t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: httpStatus }));
    await assert.rejects(requestLogin(credentials), matchesLoginError(code));
  });
}

test('login requires a valid response with a nonempty access token', async (t) => {
  for (const body of ['<html>Error</html>', 'null', '{}', '{"accessToken":""}']) {
    const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(body));
    await assert.rejects(requestLogin(credentials), matchesLoginError('unavailable'));
    fetch.mock.restore();
  }
});

test('a rejected fetch produces a network error', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('Failed to fetch');
  });
  await assert.rejects(requestLogin(credentials), matchesLoginError('network-error'));
});
