import type { DbConfigType } from './database/config.types'
import type { ControllerType, ErrorControllerType } from './router.types'

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

  MIGRATION?: MigrationType

  // ADMIN_PANEL_URL: string;
  NOT_FOUND_CONTROLLER?: ControllerType<unknown>
  ERROR_CONTROLLER?: ErrorControllerType<unknown>
  DATABASE: DatabaseType
  TEMPLATE_DIR?: string
}

export type { MigrationType, DatabaseType, SettingsType }
