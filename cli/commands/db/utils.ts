import { existsSync } from 'node:fs'
import path from 'node:path'
import type { MigrationType, SettingsType } from '../../@types/settings.types'
import { error } from '../logger'
import { getMigrationConfig } from './migrations/config'

const getSettings = async (
  cwd: string
): Promise<
  Omit<SettingsType, 'MIGRATION'> & { MIGRATION: Required<MigrationType> }
> => {
  const srcDir = path.join(cwd, 'src')

  const settingsPath = path.join(srcDir, 'settings.ts')

  if (!existsSync(settingsPath)) {
    error(
      `invalid dir please go to your project dir and the try to run migration generation command`
    )
    process.exit(1)
  }

  const { MIGRATION, ...other } = (await import(settingsPath))
    .default as SettingsType

  return {
    ...other,
    MIGRATION: getMigrationConfig(MIGRATION),
  }
}

export { getSettings }
