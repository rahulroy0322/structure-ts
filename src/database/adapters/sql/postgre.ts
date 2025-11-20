import chalk from 'chalk'
import type { Pool, PoolConfig } from 'pg'
import type { DatabaseAdapterType } from '../../../@types/database/adapters/main.types'
import type { PostGreConfigType } from '../../../@types/database/config.types'
import { SQLBuilder } from './main/builder'

const PostGreAdapter = (
  config: Omit<PostGreConfigType, 'engine'>
): DatabaseAdapterType => {
  let pool: Pool | null = null
  const builder = SQLBuilder()

  const connect: DatabaseAdapterType['connect'] = async (cb) => {
    if (pool) {
      return
    }

    try {
      const { Pool } = await import('pg')

      if ('url' in config) {
        ;(config as PoolConfig) = {
          connectionString: config.url as string,
        }
      }

      ;(config as PoolConfig).max = 10

      pool = new Pool(config as PoolConfig)

      if (cb) {
        pool.on('connect', cb)
      }

      await pool.connect()
    } catch (e) {
      if ((e as Error).message.startsWith("Cannot find module 'pg'")) {
        // biome-ignore lint/suspicious/noConsole: let user know
        console.log(chalk.redBright`please install "pg" first to use`)
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

  const run = async (
    sql: string,
    params: unknown[] | undefined = undefined
  ) => {
    if (!pool) {
      // TODO! proper error!
      throw new Error('please connect db first')
    }

    if (params?.length) {
      params = params?.map((value) =>
        typeof value === 'boolean' ? (value ? '1' : '0') : value
      )
    }

    return (await pool.query(sql, params)).rows
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

export { PostGreAdapter }
