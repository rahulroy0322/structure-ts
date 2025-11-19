// Sql
type SQLiteConfigType = {
  engine: 'sqlite'
  path: string
}

type MySQLConfigType = {
  engine: 'mysql'
} & (
  | {
      host: string
      port?: number
      user: string
      password: string
      database: string
    }
  | {
      url: string
    }
)

type PostGreConfigType = {
  engine: 'postgre'
} & (
  | {
      database: string
      host: string
      port?: number
      user: string
      password: string
    }
  | {
      url: string
    }
)

// No Sql
type MongoConfigType = {
  engine: 'mongo'
  uri: string
  db: string
}

// Base
type DbConfigType =
  | SQLiteConfigType
  | MySQLConfigType
  | PostGreConfigType
  | MongoConfigType

export type {
  SQLiteConfigType,
  DbConfigType,
  PostGreConfigType,
  MySQLConfigType,
  MongoConfigType,
}
