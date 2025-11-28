import type { DatabaseAdapterType } from '../@types/database/adapters/main.types'
import type { DbConfigType } from '../@types/database/config.types'
import { loadSettings } from '../stratus-ts/settings/main'
import { MongoAdapter } from './adapters/nosql/mongo'
import { MySqlAdapter } from './adapters/sql/mysql/main'
import { PostGreAdapter } from './adapters/sql/postgre'
import { SQLiteAdapter } from './adapters/sql/sqlite'
import { todo } from './utils'

let db: DatabaseAdapterType | null = null

const getAdapter = (config: DbConfigType): DatabaseAdapterType => {
  switch (config.engine) {
    case 'sqlite':
      return SQLiteAdapter(config)
    case 'mysql':
      return MySqlAdapter(config)
    case 'postgre':
      return PostGreAdapter(config)
    case 'mongo':
      return MongoAdapter(config)
    default:
      return todo()
  }
}

const getConnection = (config: DbConfigType): DatabaseAdapterType => {
  if (!db) {
    db = getAdapter(config)
  }
  return db
}

const connectToDb = async (): Promise<DatabaseAdapterType | null> => {
  if (!db) {
    const { DATABASE } = await loadSettings()

    if (DATABASE) {
      db = getConnection(DATABASE.config)
      await db.connect(DATABASE.onSuccess)
    }
  }

  return db
}

export { connectToDb, db }
