import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { DatabaseAdapterType } from '../../../@types/migration/db.types'
import { connectToDb } from '../../../adapters/main'
import { getMigrationAndSqlPath } from '../dir'
import { loadManeger } from '../state'
import { getSettings } from '../utils'

const migrationTableSql = (table: string) =>
  `CREATE TABLE \`${table}\` (
    name TEXT PRIMARY KEY,
    at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`

const getMigrations = async (db: DatabaseAdapterType, table: string) => {
  try {
    const res = await db.query(
      // `select * from sqlite_master`,
      `SELECT * FROM \`${table}\` ORDER BY at DESC LIMIT 1`
    )

    if ((res as [] | null)?.length) {
      return res as unknown[]
    }

    return []
  } catch (e) {
    if (
      (e as Error).message
        .toLowerCase()
        .includes(`no such table: ${table}`.toLowerCase())
    ) {
      // ! TODO
      console.log('E:', e)
      await db.exec(migrationTableSql(table))
      return []
    }

    console.error(e)
    process.exit(1)
  }
}

const getLetestMigretions = (
  migrations: string[],
  lastMigrationName: string | undefined
): string[] => {
  if (lastMigrationName) {
    const index = migrations.indexOf(lastMigrationName)

    if (index >= 0) {
      return migrations.slice(index + 1)
    }
  }

  return migrations
}

const migrate = async (_commands: string[], cwd: string) => {
  const { MIGRATION, DATABASE } = await getSettings(cwd)

  if (!DATABASE) {
    return
  }

  const db = await connectToDb({
    DATABASE: DATABASE.config,
  })
  if (!db) {
    return
  }

  await db.connect()

  MIGRATION.TABLE = 'table'
  const dbMigrations = (await getMigrations(db, MIGRATION.TABLE)) as {
    name: string
  }[]

  const { SQL_DIR, MANEGER_FILE } = getMigrationAndSqlPath(cwd, MIGRATION)

  const { migrations } = await loadManeger(MANEGER_FILE)

  const letestMigretions = getLetestMigretions(
    migrations,
    dbMigrations.at(0)?.name || undefined
  )

  for await (const migration of letestMigretions) {
    await Promise.all([
      db.exec(
        (await readFile(path.join(SQL_DIR, `${migration}.sql`))).toString()
      ),
      db.exec(
        `INSERT INTO \`${MIGRATION.TABLE}\`(name) VALUES('${migration}');`
      ),
    ])
  }

  await db.disconnect()
}

export { migrate }
