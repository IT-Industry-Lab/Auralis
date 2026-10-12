// eslint.config.mjs
import eslintConfigPrettier from 'eslint-config-prettier';
import nextPlugin from '@next/eslint-plugin-next';

const eslintConfig = [
  // 1. Подключаем правила Next.js
  nextPlugin.configs['core-web-vitals'],
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.vercel/**',
      'next-env.d.ts',
    ],
  },
  // 2. Отключаем правила, конфликтующие с Prettier
  eslintConfigPrettier,
];

export default eslintConfig;
