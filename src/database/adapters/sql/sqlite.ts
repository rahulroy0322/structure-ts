import type { Database } from 'better-sqlite3'
import chalk from 'chalk'
import type { DatabaseAdapterType } from '../../../@types/database/adapters/main.types'
import type { SQLiteConfigType } from '../../../@types/database/config.types'
import { SQLBuilder } from './main/builder'

const SQLiteAdapter = (
  config: Omit<SQLiteConfigType, 'engine'>
): DatabaseAdapterType => {
  let db: Database | null = null
  const builder = SQLBuilder()

  const connect: DatabaseAdapterType['connect'] = async (cb) => {
    if (db) {
      return
    }

    try {
      const Database = (await import('better-sqlite3')).default
      db = new Database(config.path)
      db.pragma('foreign_keys = ON')
      await cb?.()
    } catch (e) {
      if (
        (e as Error).message.startsWith("Cannot find module 'better-sqlite3'")
      ) {
        // biome-ignore lint/suspicious/noConsole: let user know
        console.log(
          chalk.redBright`please install "better-sqlite3" first to use`
        )
      } else {
        console.error(e)
      }
      process.exit(1)
    }
  }

  const disconnect: DatabaseAdapterType['disconnect'] = async (cb) => {
    if (db) {
      db.close()
      await cb?.()
    }
    db = null
  }

  const run = (
    sql: string,
    params: unknown[] | undefined = undefined,
    exec = false
  ): unknown[] => {
    if (!db) {
      // TODO! proper error!
      throw new Error('please connect db first')
    }
    sql = sql.replace(/\$\d+/gi, '?')
    if (exec) {
      // @ts-expect-error this is just for migrate
      return db.exec(sql)
    }

    return db.prepare(sql).all(params)
  }

  const find: DatabaseAdapterType['find'] = async (
    table,
    filter,
    projection = {},
    options
  ) => {
    const [sql, params] = builder.find(table, filter, projection, options)

    return run(sql, params) as any
  }

  const create: DatabaseAdapterType['create'] = async (
    table,
    data,
    projection = {}
  ) => {
    const [sql, params] = builder.create(table, data, projection)

    return run(sql, params) as any
  }

  const update: DatabaseAdapterType['update'] = async (
    table,
    filter,
    data,
    projection
    // TODO!
    // options
  ) => {
    const [sql, params] = builder.update(
      table,
      filter,
      data,
      projection
      // options
    )

    return run(sql, params) as any
  }

  const destroy: DatabaseAdapterType['destroy'] = async (
    table,
    filter,
    options
  ) => {
    const [sql, params] = builder.destroy(table, filter, options)

    return run(sql, params) as any
  }

  const raw = () => db

  return {
    connect,
    disconnect,
    create,
    update,
    destroy,
    find,
    raw,
  }
}

export { SQLiteAdapter }
