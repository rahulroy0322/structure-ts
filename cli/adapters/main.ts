import type { DbConfigType } from '../@types/db.config.types'
import type { DatabaseAdapterType } from '../@types/migration/db.types'
import { MongoAdapter } from './nosql/mongo'
import { MySqlAdapter } from './sql/mysql'
import { PostGreAdapter } from './sql/postgre'
import { SQLiteAdapter } from './sql/sqlite'
import { todo } from './utils'

const getAdapter = ({
  engine,
  ...config
}: DbConfigType): DatabaseAdapterType => {
  switch (engine) {
    case 'sqlite':
      return SQLiteAdapter(config as any)
    case 'mysql':
      return MySqlAdapter(config)
    case 'postgre':
      return PostGreAdapter(config)
    case 'mongo':
      return MongoAdapter(config as any)
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
