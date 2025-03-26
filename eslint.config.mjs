import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";


const noVars = [
  'error',
  {
    varsIgnorePattern: '^_',
    argsIgnorePattern: "^_"
  },
]

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.node } },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      'node_modules',
      'lib',
    ]
  }, {
    extends: [
      tseslint.configs.recommended,
    ],
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
      "@typescript-eslint/no-unused-vars": noVars,
      'no-unused-vars': noVars,
      'no-unused-labels': 'error',
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  }
]);