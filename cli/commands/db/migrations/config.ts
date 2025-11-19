import type { MigrationType } from '../../../@types/settings.types'

const DEFAULT_TABLE = '__migrations'

const getMigrationConfig = (
  migration?: MigrationType
): Required<MigrationType> => {
  if (!migration) {
    return {
      PATH: './.migrations',
      TABLE: DEFAULT_TABLE,
    }
  }

  if (!migration.TABLE) {
    migration.TABLE = DEFAULT_TABLE
  }

  return migration as Required<MigrationType>
}

export { getMigrationConfig }
