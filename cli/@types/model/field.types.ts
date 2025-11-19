import type { SchemaType } from './utils.types'

type FieldModelType<F> = F extends {
  type: 'enum'
  values: infer V extends readonly unknown[]
}
  ? V[number]
  : F extends { type: 'email' | 'string' }
    ? string
    : F extends { type: 'number' }
      ? number
      : F extends { type: 'bool' }
        ? boolean
        : F extends { type: 'timestamp' }
          ? Date
          : never

type InferSchemaModelType<S extends SchemaType> = {
  [K in keyof S]: FieldModelType<S[K]>
}

type RequiredFieldsType<S extends SchemaType> = {
  [Key in keyof S as S[Key] extends { required: true }
    ? Key
    : never]: FieldModelType<S[Key]>
}

// type OptionalFieldsType<S extends SchemaType> = {
//   [Key in keyof S as S[Key] extends { required: true }
//     ? never
//     : Key]?: FieldModelType<S[Key]>;
// };

type DefaultFieldsType<S extends SchemaType> = {
  [Key in keyof S as S[Key] extends { default: unknown }
    ? Key
    : never]: FieldModelType<S[Key]>
}

type ExcludedFieldsModelType<S extends SchemaType> = {
  [Key in keyof S]: S[Key] extends { select: false } ? Key : never
}[keyof S]

export type {
  InferSchemaModelType,
  RequiredFieldsType,
  // OptionalFieldsType,
  DefaultFieldsType,
  ExcludedFieldsModelType,
  FieldModelType,
}
