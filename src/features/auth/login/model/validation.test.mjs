import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('./validation.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext },
});
const { getLoginFieldError } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const invalid = { valid: false, valueMissing: false, tooLong: false };

test('an invalid email shows the UC-2 format hint', () => {
  assert.equal(
    getLoginFieldError('email', invalid),
    'The email must match the format example@example.com'
  );
});

test('empty fields show their required messages', () => {
  const missing = { ...invalid, valueMissing: true };
  assert.equal(getLoginFieldError('email', missing), 'Enter your email.');
  assert.equal(getLoginFieldError('password', missing), 'Enter your password.');
});

test('password length errors identify the relevant limit', () => {
  assert.equal(
    getLoginFieldError('password', invalid),
    'Password must contain at least 8 characters.'
  );
  assert.equal(
    getLoginFieldError('password', { ...invalid, tooLong: true }),
    'Password must contain at most 128 characters.'
  );
});

test('valid fields clear any previous validation message', () => {
  const valid = { ...invalid, valid: true };
  assert.equal(getLoginFieldError('email', valid), '');
  assert.equal(getLoginFieldError('password', valid), '');
});
