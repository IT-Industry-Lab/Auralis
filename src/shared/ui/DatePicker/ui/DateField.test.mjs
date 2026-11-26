import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const modules = new Map();

function TestImage(props) {
  return createElement('img', props);
}

function loadComponent(filename) {
  if (modules.has(filename)) return modules.get(filename).exports;
  const loadedModule = { exports: {} };
  modules.set(filename, loadedModule);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2017,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });

  runInNewContext(outputText, {
    module: loadedModule,
    exports: loadedModule.exports,
    require: (specifier) => {
      if (specifier.endsWith('.module.css')) return {};
      if (specifier === 'next/image') return TestImage;
      if (specifier.startsWith('.')) {
        const base = resolve(dirname(filename), specifier);
        const dependency = [base + '.ts', base + '.tsx'].find(existsSync);
        assert.ok(dependency, `Missing component dependency: ${specifier}`);
        return loadComponent(dependency);
      }
      return require(specifier);
    },
    process,
    setTimeout,
  });
  return loadedModule.exports;
}

const { DatePicker } = loadComponent(fileURLToPath(new URL('../DatePicker.tsx', import.meta.url)));
const minimum = new Date(2026, 0, 10);
const maximum = new Date(2026, 0, 20);

test('calendar expansion belongs to its button and preserves input descriptions', () => {
  const markup = renderToStaticMarkup(
    createElement(DatePicker, {
      id: 'birthday',
      label: 'Birthday',
      value: null,
      onChange: () => {},
      error: 'Invalid date',
      'aria-describedby': 'birthday-help',
    })
  );
  const input = markup.match(/<input\b[^>]*>/)?.[0];
  const button = markup.match(/<button\b[^>]*>/)?.[0];

  assert.ok(input);
  assert.ok(button);
  assert.doesNotMatch(input, /aria-expanded=/);
  assert.match(button, /aria-expanded="false"/);
  assert.match(markup, /<label[^>]*for="birthday"/);
  assert.match(input, /aria-describedby="birthday-help [^"]+-error"/);
  assert.match(input, /aria-invalid="true"/);
});

for (const mode of ['single', 'range']) {
  test(`${mode} fields forward native input props without calendar-only props`, () => {
    const markup = renderToStaticMarkup(
      createElement(DatePicker, {
        mode,
        value: null,
        onChange: () => {},
        onInputValidationChange: () => {},
        minDate: minimum,
        maxDate: maximum,
        name: 'period',
        form: 'profile-form',
        required: true,
        'aria-label': 'Period',
      })
    );
    const input = markup.match(/<input\b[^>]*>/)?.[0];

    assert.ok(input);
    assert.match(input, /name="period"/);
    assert.match(input, /form="profile-form"/);
    assert.match(input, /required=""/);
    assert.doesNotMatch(input, /minDate|maxDate|onInputValidationChange/i);
  });
}

for (const state of ['disabled', 'readOnly']) {
  test(`${state} fields disable the calendar button`, () => {
    const markup = renderToStaticMarkup(
      createElement(DatePicker, {
        value: null,
        onChange: () => {},
        'aria-label': 'Birthday',
        [state]: true,
      })
    );
    const button = markup.match(/<button\b[^>]*>/)?.[0];

    assert.ok(button);
    assert.match(button, /disabled=""/);
    assert.match(button, /aria-expanded="false"/);
  });
}
