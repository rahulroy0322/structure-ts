import type { SettingsType } from '../../src/@types';

const PORT = 2000;

const APPS = ['app', 'base'];

const ADMIN_PANEL_URL = '/admin';


export default {
  PORT,
  ADMIN_PANEL_URL,
  APPS
} satisfies SettingsType;
