import type { Prettify, SchemaType } from './utils.types'

type SND = string | number | Date

type FilterGeneralFieldType<T extends SND> = {
  in: T[]
  nin: T[]
  eq: T
  ne: T
}

type FilterNumDateFieldType<T extends number | Date> =
  FilterGeneralFieldType<T> & {
    bt: [T, T]
    gt: T
    lt: T
    gte: T
    lte: T
  }

type FilterStrFieldType = FilterGeneralFieldType<string> & {
  startsWith: string
  endsWith: string
  like: string
  ilike: string
}
type FilterNumFieldType = FilterNumDateFieldType<number>
type FilterDateFieldType = FilterNumDateFieldType<number | Date>
type FilterEnumFieldType<V extends readonly SND[]> = FilterGeneralFieldType<
  V[number]
>

type FilterFieldType<F extends Record<string, unknown>> = F extends {
  type: 'enum'
  values: infer V extends readonly unknown[]
}
  ? V extends SND[]
    ? Partial<FilterEnumFieldType<V>> | V[number]
    : V[number]
  : F extends { type: 'email' | 'string' }
    ? Partial<FilterStrFieldType> | string
    : F extends { type: 'number' }
      ? Partial<FilterNumFieldType> | number
      : F extends { type: 'bool' }
        ? boolean
        : F extends { type: 'timestamp' }
          ? Partial<FilterDateFieldType> | Date
          : never

type FilterModelType<S extends SchemaType> = Partial<
  Prettify<
    {
      [Key in keyof S]: FilterFieldType<S[Key]>
    } & {
      _id: Partial<FilterGeneralFieldType<string> & FilterStrFieldType> | string
      OR: FilterModelType<S>[]
      AND: FilterModelType<S>[]
    }
  >
>

type FilterKeysModelType<S extends SchemaType> = keyof FilterModelType<S>

export type { FilterModelType, FilterKeysModelType }
