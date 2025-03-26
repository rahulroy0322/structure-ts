import type { UserConfig } from '@commitlint/types';

const errorCode = 2;
const scopeMax = 7;

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

const scopeEnum = [
  'core',
  'config', //Changes to config
  'types', //Changes to types
  'setting', //Changes to setting
  'const', //Changes to constants
  'qns', //Changes to question
  'reply', //Changes to reply
  'status', //Changes to status
  'lib', //Changes to utils
  'router', //Changes to router
  'app', //Changes to app
  'cns', //Changes to controllers
  'hand', //Changes to handler
];

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [errorCode, 'always', typeEnum],
    'scope-enum': [errorCode, 'always', scopeEnum],
    'scope-max-length': [errorCode, 'always', scopeMax],
  },
} satisfies UserConfig;
