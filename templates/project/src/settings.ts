import type { DatabaseType, SettingsType } from 'structure-ts';

const PORT = 2000;

const APPS = [];

const DATABASE: DatabaseType = false;

const TEMPLATE_DIR = 'templates';

export default {
  PORT,
  APPS,
  DATABASE,
  TEMPLATE_DIR,
} satisfies SettingsType;
