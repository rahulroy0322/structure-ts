import type { ModelReturnType, ModelType } from '../@types'
import type { CreateType } from '../@types/model/create.types'
import type {
  DestroyByPKType,
  DestroyOneType,
  DestroyType,
} from '../@types/model/destroy.types'
import type {
  FindByPKType,
  FindOneType,
  FindType,
} from '../@types/model/find.types'
import type { FieldSchemaType } from '../@types/model/schema.types'
import type {
  UpdateByPKType,
  UpdateOneType,
  UpdateType,
} from '../@types/model/update.types'
import type { SchemaType } from '../@types/model/utils.types'

const getIdSchema = () =>
  ({
    type: 'pk',
    default: () => Math.random().toFixed(4).toString(),
  }) as const

const getFinalSchema = (options: Parameters<ModelType>[2] = {}) => {
  if (options.timestamp) {
    return {
      createdAt: {
        type: 'timestamp',
        default: () => new Date(),
      },
      updatedAt: {
        type: 'timestamp',
        default: () => new Date(),
        onupdate: true,
      },
      _id: getIdSchema(),
    }
  }

  return {
    _id: getIdSchema(),
  }
}

const Query = <const S extends SchemaType>(): ModelReturnType<S> => {
  // ? create
  const create: CreateType<S> = async () => {
    return []
  }

  // ? find
  const find: FindType<S> = async () => {
    return []
  }

  const findOne: FindOneType<S> = async (filter, projection) =>
    (
      await find(filter, projection, {
        limit: 1,
      })
    ).at(0) || null

  const findByPK: FindByPKType<S> = (_id, projection) =>
    findOne(
      {
        _id,
      } as any,
      projection
    )

  //? update
  const update: UpdateType<S> = async () => {
    return []
  }

  const updateOne: UpdateOneType<S> = async (filter, data, projection) =>
    (
      await update(filter, data, projection, {
        limit: 1,
      })
    ).at(0) || null

  const updateByPK: UpdateByPKType<S> = (_id, data, projection) =>
    updateOne(
      {
        _id,
      } as any,
      data,
      projection
    )

  //? destroy
  const destroy: DestroyType<S> = async () => {
    return []
  }

  const destroyOne: DestroyOneType<S> = async (filter) =>
    (
      await destroy(filter, {
        limit: 1,
      })
    ).at(0) || null

  const destroyByPK: DestroyByPKType<S> = (_id) =>
    destroyOne({
      _id,
    } as any)

  const res: ModelReturnType<S> = {
    // ? create
    create,
    // ? find
    find,
    findOne,
    findByPK,
    // ? update
    update,
    updateOne,
    updateByPK,
    // ? destroy
    destroy,
    destroyOne,
    destroyByPK,
  }

  return res
}

const Model = (<const S extends Record<keyof S, FieldSchemaType<S[keyof S]>>>(
  table: string,
  schema: S,
  options?: {
    timestamp?: boolean
  }
) => {
  if (!table.endsWith('s')) {
    table = table.concat('s')
  }
  schema = { ...schema, ...getFinalSchema(options) }

  const res = Query<S>()

  Object.assign(res, {
    schema,
    table,
  })

  return res
}) satisfies ModelType

export { Model }
