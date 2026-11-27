import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('./types.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext },
});
const { toRegisterCredentials } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const formValues = {
  username: 'alex_123',
  email: 'alex@example.com',
  password: 'StrongPassword123!',
  passwordConfirmation: 'StrongPassword123!',
  agreeToTerms: true,
};

test('registration payload uses the API field names and order', () => {
  const credentials = toRegisterCredentials(formValues);

  assert.deepEqual(credentials, {
    username: 'alex_123',
    email: 'alex@example.com',
    password: 'StrongPassword123!',
    passwordConfirmation: 'StrongPassword123!',
    acceptedTerms: true,
  });
  assert.deepEqual(Object.keys(credentials), [
    'username',
    'email',
    'password',
    'passwordConfirmation',
    'acceptedTerms',
  ]);
});

test('registration payload carries an unchecked terms value as false', () => {
  const credentials = toRegisterCredentials({ ...formValues, agreeToTerms: false });

  assert.equal(credentials.acceptedTerms, false);
});
