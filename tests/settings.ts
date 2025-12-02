import type { DatabaseType, SettingsType } from '../src/@types'

const PORT = 3000

const APPS: SettingsType['APPS'] = ['home']

const DATABASE: DatabaseType = false

const TEMPLATE_DIR = 'templates'

export default {
  PORT,
  APPS,
  DATABASE,
  TEMPLATE_DIR,
} satisfies SettingsType
