import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('./validation.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext },
});
const { registerValidation } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const passwordPattern = registerValidation.password.pattern.value;
const passwordPatternMessage = registerValidation.password.pattern.message;

test('password requires at least one special character', () => {
  assert.equal(passwordPattern.test('StrongPassword123'), false);
  assert.equal(passwordPattern.test('StrongPassword123!'), true);
});

test('password accepts every supported special character', () => {
  const specialCharacters = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

  for (const character of specialCharacters) {
    assert.equal(passwordPattern.test(`Aa1${character}bcdef`), true, character);
  }
});

test('password rejects characters outside the allowed set', () => {
  assert.equal(passwordPattern.test('StrongPassword123 '), false);
  assert.equal(passwordPattern.test('Пароль123!'), false);
});

test('password pattern message explains the special character requirement', () => {
  assert.match(passwordPatternMessage, /special character/);
});
