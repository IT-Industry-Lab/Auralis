import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

// Use the project's TypeScript compiler; no runner or runtime configuration is needed.
const source = await readFile(new URL('./date.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext },
});
const { parseDate, formatDate, parseRange, formatRange, isWithinBounds, clampDate } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

test('dates reject impossible days, incomplete input, mixed separators, and year zero', () => {
  for (const text of [
    '31/02/2024',
    '29/02/2023',
    '00/12/2000',
    '12/13/2000',
    '12.01/2000',
    '12/0',
    '01/01/0000',
  ]) {
    assert.equal(parseDate(text), null, text);
  }
  assert.equal(formatDate(parseDate('29/02/2024')), '29/02/2024');
  assert.equal(formatDate(parseDate(' 12.12.2001 ')), '12/12/2001');
});

test('dates preserve local calendar days and years below 100', () => {
  const date = parseDate('05/11/0099');
  assert.equal(date.getFullYear(), 99);
  assert.equal(date.getMonth(), 10);
  assert.equal(date.getDate(), 5);
  assert.equal(date.getHours(), 0);
  assert.equal(formatDate(date), '05/11/0099');
  assert.equal(formatDate(null), '');
});

test('ranges span months and years and allow a single-day interval', () => {
  assert.equal(formatRange(parseRange('28/12/2022 - 10/01/2023')), '28/12/2022 - 10/01/2023');
  assert.equal(formatRange(parseRange('05.11.2026–05.11.2026')), '05/11/2026 - 05/11/2026');
  assert.equal(parseRange('10/01/2023 - 28/12/2022'), null);
  assert.equal(parseRange('28/12/2022 - '), null);
  assert.equal(parseRange('28/12/2022 - 31/02/2023'), null);
  assert.equal(parseRange('01/01/2024 - 02/01/2024 - 03/01/2024'), null);
  assert.equal(formatRange(null), '');
});

test('bounds are inclusive calendar days, ignoring the time of day', () => {
  const minimum = new Date(2026, 10, 5, 22);
  const maximum = new Date(2026, 10, 10, 1);
  assert.equal(isWithinBounds(parseDate('05/11/2026'), minimum, maximum), true);
  assert.equal(isWithinBounds(new Date(2026, 10, 10, 23), minimum, maximum), true);
  assert.equal(isWithinBounds(parseDate('04/11/2026'), minimum, maximum), false);
  assert.equal(isWithinBounds(parseDate('11/11/2026'), minimum, maximum), false);
});

test('the opening month stays on the current date unless bounds exclude it', () => {
  const current = parseDate('05/11/2026');
  const minimum = parseDate('01/01/2020');
  const maximum = parseDate('31/12/2030');
  assert.equal(clampDate(current, minimum, maximum), current);
  assert.equal(clampDate(parseDate('31/12/2019'), minimum, maximum), minimum);
  assert.equal(clampDate(parseDate('01/01/2031'), minimum, maximum), maximum);
});
