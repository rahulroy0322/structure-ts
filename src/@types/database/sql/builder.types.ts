import type { InferSchemaModelType } from '../../model/field.types'
import type { FilterModelType } from '../../model/filter.types'
import type { CreateInputType } from '../../model/input.model'
import type { OptionsModelType } from '../../model/options.types'
import type { ProjectionType } from '../../model/projection.types'
import type { SchemaType } from '../../model/utils.types'

type SqlBuilderType = {
  create<P extends ProjectionType<SchemaType> | undefined = undefined>(
    table: string,
    data: CreateInputType<SchemaType>[],
    projection?: P
  ): [string, unknown[]]

  find<P extends ProjectionType<SchemaType> | undefined = undefined>(
    table: string,
    filter: FilterModelType<SchemaType>,
    projection?: P,
    options?: OptionsModelType<SchemaType>
  ): [string, unknown[]]

  update<P extends ProjectionType<SchemaType> | undefined = undefined>(
    table: string,
    filter: FilterModelType<SchemaType>,
    data: Partial<InferSchemaModelType<SchemaType>>,
    projection?: P
    // options?: OptionsModelType<S>
  ): [string, unknown[]]

  destroy(
    table: string,
    filter: FilterModelType<SchemaType>,
    options?: OptionsModelType<SchemaType>
  ): [string, unknown[]]
}

export type { SqlBuilderType }
