import type { InferSchemaModelType } from './field.types'
import type { FilterModelType } from './filter.types'
import type { OptionsModelType } from './options.types'
import type { ProjectionType } from './projection.types'
import type { ResWithProjectionType } from './res.types'
import type { AtLeastOneType, SchemaType, WithId } from './utils.types'

type UpdateReturnType<
  S extends SchemaType,
  P extends ProjectionType<S> | undefined = undefined,
> = WithId<ResWithProjectionType<S, P>>

type UpdateType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  filter: FilterModelType<S>,
  data: AtLeastOneType<InferSchemaModelType<S>>,
  projection?: P,
  options?: OptionsModelType<S>
) => Promise<UpdateReturnType<S, P>[]>

type UpdateOneType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  filter: FilterModelType<S>,
  data: AtLeastOneType<InferSchemaModelType<S>>,
  projection?: P
) => Promise<UpdateReturnType<S, P> | null>

type UpdateByPKType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  pk: string,
  data: AtLeastOneType<InferSchemaModelType<S>>,
  projection?: P
) => Promise<UpdateReturnType<S, P> | null>

export type { UpdateByPKType, UpdateOneType, UpdateType }
