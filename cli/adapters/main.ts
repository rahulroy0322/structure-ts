import type { DbConfigType } from '../@types/db.config.types'
import type { DatabaseAdapterType } from '../@types/migration/db.types'
import { SQLiteAdapter } from './sql/sqlite'
import { todo } from './utils'

const getAdapter = (config: DbConfigType): DatabaseAdapterType => {
  switch (config.engine) {
    case 'sqlite':
      return SQLiteAdapter(config)
    // case 'mysql':
    //   return MySqlAdapter(config)
    // case 'postgre':
    //   return PostGreAdapter(config)
    // case 'mongo':
    //   return MongoAdapter(config)
    default:
      return todo()
  }
}

const connectToDb = async ({
  DATABASE,
}: {
  DATABASE: DbConfigType
}): Promise<DatabaseAdapterType | null> => {
  return getAdapter(DATABASE)
}

export { connectToDb }
