import type { Database } from 'better-sqlite3'
import chalk from 'chalk'
import type { SQLiteConfigType } from '../../@types/db.config.types'
import type { DatabaseAdapterType } from '../../@types/migration/db.types'

const SQLiteAdapter = (
  config: Omit<SQLiteConfigType, 'engine'>
): DatabaseAdapterType => {
  let db: Database | null = null

  const connect: DatabaseAdapterType['connect'] = async () => {
    try {
      const Database = (await import('better-sqlite3')).default
      db = new Database(config.path)
      db.pragma('foreign_keys = ON')
    } catch (e) {
      if (
        (e as Error).message.startsWith("Cannot find module 'better-sqlite3'")
      ) {
        console.log(
          chalk.redBright`please install "better-sqlite3" first to use`
        )
      } else {
        console.error(e)
      }
      process.exit(1)
    }
  }

  const disconnect: DatabaseAdapterType['disconnect'] = async () => {
    if (db) {
      db.close()
    }
    db = null
  }

  const checkConn = () => {
    if (!db) {
      // TODO! proper error!
      throw new Error('please connect db first')
    }
  }

  const exec: DatabaseAdapterType['exec'] = async (sql) => {
    checkConn()

    // biome-ignore lint/style/noNonNullAssertion: checked up
    return db!.exec(sql)
  }

  const query: DatabaseAdapterType['query'] = async (sql) => {
    checkConn()

    // biome-ignore lint/style/noNonNullAssertion: checked up
    return db!.prepare(sql).all()
  }

  return {
    query,
    connect,
    disconnect,
    exec,
  }
}

export { SQLiteAdapter }
