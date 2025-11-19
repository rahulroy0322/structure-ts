import type { Prettify, SchemaType } from './utils.types'

type OptionsModelType<S extends SchemaType> = Prettify<
  Partial<{
    limit: number
    skip: number
    orderBy: Partial<Record<keyof S, 'ASC' | 'DESC'>>
  }>
>

export type { OptionsModelType }
