import type { InferSchemaModelType } from './field.types'
import type { CreateInputType } from './input.model'
import type { ProjectionType } from './projection.types'
import type { ResWithProjectionType } from './res.types'
import type { SchemaType, WithId } from './utils.types'

type CreateType<S extends SchemaType> = <
  P extends ProjectionType<S> | undefined = undefined,
>(
  data: CreateInputType<S>[],
  projection?: P
) => Promise<
  WithId<
    P extends ProjectionType<S>
      ? ResWithProjectionType<S, P>
      : InferSchemaModelType<S>
  >[]
>

export type { CreateType }
