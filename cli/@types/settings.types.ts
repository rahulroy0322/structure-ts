import type { DbConfigType } from './db.config.types'

type DatabaseType =
  | false
  | {
      onSuccess?: () => void
      config: DbConfigType
    }

type MigrationType = {
  PATH: string
  TABLE?: string
}

type SettingsType = {
  PORT: number
  APPS: string[]
  ADMIN_PANEL_URL: string
  DATABASE: DatabaseType
  TEMPLATE_DIR?: string

  MIGRATION?: MigrationType
}

export type { MigrationType, DatabaseType, SettingsType }
