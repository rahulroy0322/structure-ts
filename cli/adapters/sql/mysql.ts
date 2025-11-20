import chalk from 'chalk'
import type { Pool } from 'mysql2/promise'
import type { MySQLConfigType } from '../../@types/db.config.types'
import type { DatabaseAdapterType } from '../../@types/migration/db.types'

const MySqlAdapter = (
  config: Omit<MySQLConfigType, 'engine'>
): DatabaseAdapterType => {
  let pool: Pool | null = null

  const connect: DatabaseAdapterType['connect'] = async () => {
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

      await pool.connect()
    } catch (e) {
      if (
        (e as Error).message.startsWith("Cannot find module 'mysql2/promise'")
      ) {
        console.log(chalk.redBright`please install "mysql2" first to use`)
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

  // const run = async (sql: string, params: unknown[] = [], internal = false) => {
  //   if (!pool) {
  //     // TODO! proper error!
  //     throw new Error('please connect db first')
  //   }
  //   sql = sql.replace(/\$\d+/gi, '?')

  //   if (internal) {
  //     return await pool.execute(sql, params)
  //   }

  //   const queryData = query(sql, params as string[])

  //   if (!queryData) {
  //     throw new Error(`invalid sql format!`)
  //   }

  //   const {
  //     queries: [firstQuery, secondQuery],
  //     invert,
  //   } = queryData

  //   if (invert) {
  //     if (secondQuery) {
  //       const secondReturn = await exec(secondQuery.sql, secondQuery.values)

  //       await exec(firstQuery.sql, firstQuery.values)

  //       return secondReturn
  //     }
  //     const error = new Error('some thing went wrong in invert query!')

  //     ;(error as any).metaData = queryData

  //     throw error
  //   }

  //   const firstReturn = await exec(firstQuery.sql, firstQuery.values)

  //   if (!secondQuery) {
  //     return firstReturn
  //   }

  //   return await exec(secondQuery.sql, secondQuery.values)
  // }

  //! TODO properly cxheck it
  const exec: DatabaseAdapterType['exec'] = (sql: string) => {
    checkConn()

    // biome-ignore lint/style/noNonNullAssertion: checked up
    return pool!.execute(sql)
  }
  const query: DatabaseAdapterType['query'] = (sql: string) => {
    checkConn()

    // biome-ignore lint/style/noNonNullAssertion: checked up
    return pool!.query(sql)
  }

  return {
    connect,
    disconnect,
    exec,
    query,
  }
}

export { MySqlAdapter }
