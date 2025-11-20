import type { InferSchemaModelType } from '../../model/field.types'
import type { FilterModelType } from '../../model/filter.types'
import type { CreateInputType } from '../../model/input.model'
import type { OptionsModelType } from '../../model/options.types'
import type { ProjectionType } from '../../model/projection.types'
import type { SchemaType, WithId } from '../../model/utils.types'

type DatabaseAdapterType = {
  connect(cb?: () => Promise<void> | void): Promise<void>
  disconnect(cb?: () => Promise<void> | void): Promise<void>
  // run(sql: string, params?: unknown[]): Promise<unknown[]>;

  // transaction?(fn: (trx: DatabaseAdapter) => Promise<any>): Promise<any>;

  // migrate?(sql: string): Promise<void>;

  raw(): unknown

  find: <T extends SchemaType>(
    table: string,
    filter: FilterModelType<SchemaType>,
    projection?: ProjectionType<SchemaType>,
    options?: OptionsModelType<SchemaType>
  ) => Promise<WithId<T>[]>

  create: <T extends SchemaType>(
    table: string,
    data: CreateInputType<SchemaType>[],
    projection?: ProjectionType<SchemaType>
  ) => Promise<WithId<T>[]>

  update: <T extends SchemaType>(
    table: string,
    filter: FilterModelType<SchemaType>,
    data: Partial<InferSchemaModelType<SchemaType>>,
    projection?: ProjectionType<SchemaType>,
    options?: OptionsModelType<SchemaType>
  ) => Promise<WithId<T>[]>

  destroy: <T extends SchemaType>(
    table: string,
    filter: FilterModelType<SchemaType>,
    options?: OptionsModelType<SchemaType>
  ) => Promise<WithId<T>[]>
}

export type { DatabaseAdapterType }
