import type { ModelType } from '../../../@types/model.types'
import type { MigrationType } from '../../../@types/settings.types'
import { getMigrationAndSqlPath } from '../dir'
import { getNewState, loadManeger } from '../state'
import { saveManeger, saveSql } from './fs'
import { getSql } from './sql'

const generate = async (
  cwd: string,
  models: ModelType[],
  migrationConfig: Required<MigrationType>,
  //   migrations: string[],
  migrationName?: string
) => {
  const { SQL_DIR, MANEGER_FILE } = getMigrationAndSqlPath(cwd, migrationConfig)

  const currentState = await loadManeger(MANEGER_FILE)

  const newState = getNewState(models, currentState.migrations, migrationName)

  if (JSON.stringify(currentState.tables) !== JSON.stringify(newState.tables)) {
    const migrations = newState.migrations

    await saveSql(
      SQL_DIR,
      migrations[migrations.length - 1]?.toString() || typeof undefined,
      getSql(currentState, newState)
    )

    await saveManeger(MANEGER_FILE, newState)

    return {
      tables: newState.tables.length - currentState.tables.length,
      migration: newState.migrations.at(-1),
    }
  }

  return false
}

export { generate }
