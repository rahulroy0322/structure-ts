import type { DatabaseType, SettingsType } from 'stratus-ts'

const PORT = 3000

const APPS: SettingsType['APPS'] = []

const DATABASE: DatabaseType = {
  config: {
    engine: 'sqlite',
    path: './sqlite.db',
  },
  onSuccess: () => {
    console.log('database connected successfully')
  },
}

const TEMPLATE_DIR = 'templates'

export default {
  PORT,
  APPS,
  DATABASE,
  TEMPLATE_DIR,
} satisfies SettingsType
