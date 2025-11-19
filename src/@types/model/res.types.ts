import type {
  ExcludedFieldsModelType,
  InferSchemaModelType,
} from './field.types'
import type { ProjectionType } from './projection.types'
import type { SchemaType } from './utils.types'

type ResWithProjectionType<
  S extends SchemaType,
  P extends ProjectionType<S> | undefined,
> = P extends ProjectionType<S>
  ? {
      [Key in keyof P as P[Key] extends true
        ? Key
        : never]: Key extends keyof InferSchemaModelType<S>
        ? InferSchemaModelType<S>[Key]
        : never
    }
  : Omit<InferSchemaModelType<S>, ExcludedFieldsModelType<S>>

export type { ResWithProjectionType }
