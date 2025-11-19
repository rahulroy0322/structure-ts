import type { Prettify, SchemaType } from './utils.types'

type ProjectionType<S extends SchemaType> = Prettify<
  Partial<{
    [Key in keyof S]: boolean
  }>
>

export type { ProjectionType }
