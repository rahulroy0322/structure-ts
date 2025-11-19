import type { FilterModelType } from './filter.types'
import type { OptionsModelType } from './options.types'
import type { ProjectionType } from './projection.types'
import type { ResWithProjectionType } from './res.types'
import type { SchemaType, WithId } from './utils.types'

type FindReturnType<
  S extends SchemaType,
  P extends ProjectionType<S> | undefined = undefined,
> = WithId<ResWithProjectionType<S, P>>

type FindType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  filter?: FilterModelType<S>,
  projection?: P,
  options?: OptionsModelType<S>
) => Promise<FindReturnType<S, P>[]>

type FindByPKType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  pk: string,
  projection?: P
) => Promise<FindReturnType<S, P> | null>

type FindOneType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  filter?: FilterModelType<S>,
  projection?: P
) => Promise<FindReturnType<S, P> | null>

export type { FindOneType, FindByPKType, FindType }
