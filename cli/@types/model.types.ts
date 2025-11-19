import type { FieldSchemaType, PkType } from './model/schema.types'

type ModelType = {
  schema: Record<string, FieldSchemaType<any> | PkType> //<unknown> | EnumSchemaType<any>>;
  table: string
}

export type { ModelType }
