type Prettify<Obj extends Record<string, unknown>> = {
  readonly [Key in keyof Obj]: Obj[Key]
} & {}

type SchemaType = Record<string, Record<string, unknown>>

type WithId<T extends Record<string, unknown>> = Prettify<T & { _id: string }>

type AtLeastOneType<T extends Record<string, unknown>> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

type ParamsUtilType = Record<string, string | number | boolean>

export type { Prettify, ParamsUtilType, SchemaType, WithId, AtLeastOneType }
