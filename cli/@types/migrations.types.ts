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
    length?: number
  } & FieldSchemaType<any>
>

type TableSchemaType = {
  table: string
  columns: ColumnSchemaType[]
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
  ColumnSchemaType,
  MigrationFieldType,
}
