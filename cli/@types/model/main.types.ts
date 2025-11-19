import type { CreateType } from './create.types'
import type {
  DestroyByPKType,
  DestroyOneType,
  DestroyType,
} from './destroy.types'
import type { FindByPKType, FindOneType, FindType } from './find.types'
import type { FieldSchemaType } from './schema.types'
import type { UpdateByPKType, UpdateOneType, UpdateType } from './update.types'
import type { Prettify, SchemaType } from './utils.types'

type ModelReturnType<S extends SchemaType> = {
  create: CreateType<S>

  find: FindType<S>
  findByPK: FindByPKType<S>
  findOne: FindOneType<S>

  update: UpdateType<S>
  updateOne: UpdateOneType<S>
  updateByPK: UpdateByPKType<S>

  destroy: DestroyType<S>
  destroyOne: DestroyOneType<S>
  destroyByPK: DestroyByPKType<S>
}

type ModelType = <const S extends Record<keyof S, FieldSchemaType<S[keyof S]>>>(
  table: string,
  schema: S,
  options?: {
    timestamp?: boolean
  }
) => Prettify<ModelReturnType<S>>

export type { ModelType, ModelReturnType }
