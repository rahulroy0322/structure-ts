import type { FieldModelType, InferSchemaModelType } from './field.types'
import type { Prettify, SchemaType, WithId } from './utils.types'

type RequiredFieldsType<S extends SchemaType> = {
  [Key in keyof S as S[Key] extends { required: true }
    ? S[Key] extends { default: any }
      ? never
      : Key
    : never]: FieldModelType<S[Key]>
}

type CreateInputType<S extends SchemaType> = Prettify<
  Partial<WithId<InferSchemaModelType<S>>> & RequiredFieldsType<S>
>

export type { CreateInputType }
