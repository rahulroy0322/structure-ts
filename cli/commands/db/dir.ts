import path from 'node:path'
import type { MigrationType } from '../../@types/settings.types'

const getMigrationAndSqlPath = (
  cwd: string,
  migrationConfig: Required<MigrationType>
) => {
  const MIGRATION_DIR = path.relative(
    process.cwd(),
    path.join(cwd, migrationConfig.PATH)
  )

  const SQL_DIR = path.join(MIGRATION_DIR, 'sql')

  const MANEGER_FILE = path.join(MIGRATION_DIR, 'main.json')

  return {
    SQL_DIR,
    MANEGER_FILE,
  }
}

export { getMigrationAndSqlPath }
