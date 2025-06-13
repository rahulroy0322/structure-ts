import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';

const noVars = [
  'error',
  {
    varsIgnorePattern: '^_',
    argsIgnorePattern: '^_',
  },
];

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['node_modules', 'lib','bin'],
  },
  {
    extends: [tseslint.configs.recommended],
    rules: {
      'no-var': 'error',
      'no-await-in-loop': 'error',
      'no-empty': 'error',
      'prefer-spread': 'warn',
      curly: 'error',
      'no-func-assign': 'error',
      'no-irregular-whitespace': 'error',
      'require-await': 'error',
      camelcase: 'error',
      'no-magic-numbers': 'error',
      'no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-vars': noVars,
      'no-unused-vars': noVars,
      'no-unused-labels': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['cli/**/*.ts'],
    rules: {
      'no-magic-numbers': 'off',
      'no-await-in-loop': 'off',
      'no-console': 'off',
    },
  },
]);
