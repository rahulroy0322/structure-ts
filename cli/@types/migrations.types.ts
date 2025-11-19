import type {
  DefaultSchemaType,
  EnumSchemaType,
  FieldSchemaType,
} from './model/schema.types'
import type { Prettify } from './model/utils.types'

type CommandType = () => Promise<void>

type MigrationFieldType =
  | FieldSchemaType<unknown>
  | EnumSchemaType<any>
  | ({
      type: 'pk'
    } & DefaultSchemaType)

type ColumnSchemaType = Prettify<
  {
    key: string
    // type: MigrationFieldType['type'];
    // required?: boolean;
    // default?: unknown;
    // values?: unknown[];
  } & FieldSchemaType<any>
>

type IndexSchemaType = {
  name: string
  key: string
  unique: boolean
  pk: boolean
}

type TableSchemaType = {
  table: string
  columns: ColumnSchemaType[]
  indexes: IndexSchemaType[]
}

type StateType = {
  at: number
  tables: TableSchemaType[]
  migrations: string[]
}

export type {
  CommandType,
  StateType,
  TableSchemaType,
  IndexSchemaType,
  ColumnSchemaType,
  MigrationFieldType,
}
