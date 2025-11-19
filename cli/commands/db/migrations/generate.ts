// import path from 'node:path';
// import type { OrmConfigType } from '../../@types/orm.config';
// import type { MigrationType } from '../../types';
// import { cwd } from '../utils';
// import { saveManeger, saveSql } from './fs';
// import { getSql } from './sql';
// import { getNewState, loadManeger } from './state';

import path from 'node:path'
import type { ModelType } from '../../../@types/model.types'
import type { MigrationType } from '../../../@types/settings.types'

import { saveManeger, saveSql } from './fs'
import { getSql } from './sql'
import { getNewState, loadManeger } from './state'

const generate = async (
  cwd: string,
  models: ModelType[],
  migrationConfig: Required<MigrationType>,
  //   migrations: string[],
  migrationName?: string
) => {
  const MIGRATION_DIR = path.relative(
    process.cwd(),
    path.join(cwd, migrationConfig.PATH)
  )

  const SQL_DIR = path.join(MIGRATION_DIR, 'sql')

  const MANEGER_FILE = path.join(MIGRATION_DIR, 'main.json')

  const currentState = await loadManeger(MANEGER_FILE)

  const newState = getNewState(models, currentState.migrations, migrationName)

  if (JSON.stringify(currentState.tables) !== JSON.stringify(newState.tables)) {
    const migrations = newState.migrations

    const _path = await saveSql(
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
