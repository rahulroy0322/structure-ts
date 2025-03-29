import type { DatabaseType, SettingsType } from '../../src/@types';

const PORT = 2000;

const APPS = ['app', 'base'];

const ADMIN_PANEL_URL = '/admin';

const dbConnected = () => {
  // eslint-disable-next-line no-console
  console.log(`database connection successful!`);
};

const DATABASE = {
  config: {
    mode: 'mysql',
    auth: {
      host: 'localhost',
      user: 'root',
      password: 'passwd',
      database: 'test',
    },
  },
  onSuccess: dbConnected,
} as DatabaseType;

export default {
  PORT,
  ADMIN_PANEL_URL,
  APPS,
  DATABASE,
} satisfies SettingsType;
