import chalk from 'chalk'
import type { Pool } from 'mysql2/promise'
import type { DatabaseAdapterType } from '../../../../@types/database/adapters/main.types'
import type { MySQLConfigType } from '../../../../@types/database/config.types'
import { SQLBuilder } from '../main/builder'
import { query } from './query'

const MySqlAdapter = (
  config: Omit<MySQLConfigType, 'engine'>
): DatabaseAdapterType => {
  let pool: Pool | null = null
  const builder = SQLBuilder()

  const connect: DatabaseAdapterType['connect'] = async (cb) => {
    if (pool) {
      return
    }
    try {
      const { createPool } = await import('mysql2/promise')

      if ('url' in config) {
        pool = createPool(config.url as string)
      } else {
        pool = createPool({
          ...config,
          waitForConnections: true,
          connectionLimit: 10,
        })
      }
      if (cb) {
        pool.on('connection', cb)
      }

      await pool.connect()
    } catch (e) {
      if (
        (e as Error).message.startsWith("Cannot find module 'mysql2/promise'")
      ) {
        // biome-ignore lint/suspicious/noConsole: let user know
        console.log(chalk.redBright`please install "mysql2" first to use`)
      } else {
        console.error(e)
      }
      process.exit(1)
    }
  }

  const disconnect: DatabaseAdapterType['disconnect'] = async (cb) => {
    if (pool) {
      await pool.end()
      await cb?.()
    }
    pool = null
  }

  // biome-ignore lint/style/noNonNullAssertion: it will be there
  const exec = (sql: string, values: unknown[]) => pool!.query(sql, values)

  const run = async (sql: string, params: unknown[] = [], internal = false) => {
    if (!pool) {
      // TODO! proper error!
      throw new Error('please connect db first')
    }
    sql = sql.replace(/\$\d+/gi, '?')

    if (internal) {
      return await pool.execute(sql, params)
    }

    const queryData = query(sql, params as string[])

    if (!queryData) {
      throw new Error(`invalid sql format!`)
    }

    const {
      queries: [firstQuery, secondQuery],
      invert,
    } = queryData

    if (invert) {
      if (secondQuery) {
        const secondReturn = await exec(secondQuery.sql, secondQuery.values)

        await exec(firstQuery.sql, firstQuery.values)

        return secondReturn
      }
      const error = new Error('some thing went wrong in invert query!')

      ;(error as any).metaData = queryData

      throw error
    }

    const firstReturn = await exec(firstQuery.sql, firstQuery.values)

    if (!secondQuery) {
      return firstReturn
    }

    return await exec(secondQuery.sql, secondQuery.values)
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

  const raw = () => pool

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

export { MySqlAdapter }
