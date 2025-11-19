import type { InferSchemaModelType } from './field.types'
import type { FilterModelType } from './filter.types'
import type { OptionsModelType } from './options.types'
import type { SchemaType, WithId } from './utils.types'

type DestroyReturnType<S extends SchemaType> = WithId<InferSchemaModelType<S>>

type DestroyType<S extends SchemaType> = (
  filter: FilterModelType<S>,
  options?: OptionsModelType<S>
) => Promise<DestroyReturnType<S>[]>

type DestroyOneType<S extends SchemaType> = (
  filter: FilterModelType<S>
) => Promise<DestroyReturnType<S> | null>

type DestroyByPKType<S extends SchemaType> = (
  pk: string
) => ReturnType<DestroyOneType<S>>

export type { DestroyType, DestroyOneType, DestroyByPKType }
