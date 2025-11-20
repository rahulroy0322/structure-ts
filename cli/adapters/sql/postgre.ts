import chalk from 'chalk'
import type { Pool, PoolConfig } from 'pg'
import type { PostGreConfigType } from '../../@types/db.config.types'
import type { DatabaseAdapterType } from '../../@types/migration/db.types'

const PostGreAdapter = (
  config: Omit<PostGreConfigType, 'engine'>
): DatabaseAdapterType => {
  let pool: Pool | null = null

  const connect: DatabaseAdapterType['connect'] = async () => {
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

      await pool.connect()
    } catch (e) {
      if ((e as Error).message.startsWith("Cannot find module 'pg'")) {
        console.log(chalk.redBright`please install "pg" first to use`)
      } else {
        console.error(e)
      }
      process.exit(1)
    }
  }

  const disconnect: DatabaseAdapterType['disconnect'] = async () => {
    if (pool) {
      await pool.end()
    }
    pool = null
  }

  const checkConn = () => {
    if (!pool) {
      // TODO! proper error!
      throw new Error('please connect db first')
    }
  }
  //   const run = async (
  //     sql: string,
  //     params: unknown[] | undefined = undefined
  //   ) => {
  //     if (!pool) {
  //       // TODO! proper error!
  //       throw new Error('please connect db first')
  //     }

  //     if (params?.length) {
  //       params = params?.map((value) =>
  //         typeof value === 'boolean' ? (value ? '1' : '0') : value
  //       )
  //     }

  //     return (await pool.query(sql, params)).rows
  //   }

  //! TODO properly cxheck it
  const exec: DatabaseAdapterType['exec'] = async (sql) => {
    checkConn()

    // biome-ignore lint/style/noNonNullAssertion: checked up
    return (await pool!.query(sql)).rows
  }

  const query: DatabaseAdapterType['query'] = async (sql) => {
    checkConn()

    // biome-ignore lint/style/noNonNullAssertion: checked up
    return (await pool!.query(sql)).rows
  }

  return {
    connect,
    disconnect,
    exec,
    query,
  }
}

export { PostGreAdapter }
