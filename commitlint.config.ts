import type { UserConfig } from '@commitlint/types';

const errorCode = 2;

const typeEnum = [
  'build', //Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  'docs', //Documentation only changes
  'feat', //A new feature
  'fix', //A bug fix
  'perf', //A code change that improves performance
  'refactor', //A code change that neither fixes a bug nor adds a feature
  'style', //Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  'test', //Adding missing tests or correcting existing tests
];

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [errorCode, 'always', typeEnum],
    'scope-enum': [errorCode, undefined as unknown as 'always', typeEnum],
  },
} satisfies UserConfig;
