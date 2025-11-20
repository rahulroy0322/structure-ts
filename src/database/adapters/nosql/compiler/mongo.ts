import type { DatabaseMongoCompiler } from '../../../../@types/database/mongo/compiler.types'
import type { InferSchemaModelType } from '../../../../@types/model/field.types'
import type {
  FilterKeysModelType,
  FilterModelType,
} from '../../../../@types/model/filter.types'
import type { SchemaType } from '../../../../@types/model/utils.types'

const filterImpl = <S extends SchemaType>(
  filter: Partial<FilterModelType<S>>
) => {
  const entries = Object.entries(filter)

  for (let [_key, entry] of entries) {
    const key = _key as keyof typeof filter
    if (key === 'OR' || key === 'AND') {
      ;(entry as unknown as InferSchemaModelType<SchemaType>[]).map((v) =>
        filterImpl(v)
      )

      delete filter[key]
      ;(filter as any)[key === 'AND' ? '$and' : '$or'] = entry
      continue
    }

    if (typeof entry === 'object') {
      for (const [_key2, op] of Object.entries(entry)) {
        const key2 = _key2 as keyof typeof entry
        switch (key2 as FilterKeysModelType<S>) {
          case 'in':
            delete entry[key2]
            entry = {
              ...entry,
              $in: op,
            }
            break
          case 'nin':
            delete entry[key2]
            entry = {
              ...entry,
              $nin: op,
            }
            break
          case 'eq':
            delete entry[key2]
            entry = {
              ...entry,
              $eq: op,
            }
            break
          case 'ne':
            delete entry[key2]
            entry = {
              ...entry,
              $ne: op,
            }
            break
          case 'startsWith':
            delete entry[key2]
            entry = {
              ...entry,
              $regex: new RegExp(`^${op}`, 'ig'),
            }
            break
          case 'endsWith':
            delete entry[key2]
            entry = {
              ...entry,
              $regex: new RegExp(`${op}$`, 'ig'),
            }
            break
          case 'like':
          case 'ilike':
            delete entry[key2]
            entry = {
              ...entry,
              $regex: new RegExp(`${op}`, 'ig'),
            }
            break
          case 'bt': {
            const [first, last] = (
              (op || []) as unknown as [number, number]
            ).sort((a, b) => a - b)

            delete entry[key2]
            entry = {
              ...entry,
              $gte: first,
              $lte: last,
            }
            break
          }
          case 'gt':
            delete entry[key2]
            entry = {
              ...entry,
              $gt: op,
            }
            break
          case 'lt':
            delete entry[key2]
            entry = {
              ...entry,
              $lt: op,
            }
            break
          case 'gte':
            delete entry[key2]
            entry = {
              ...entry,
              $gte: op,
            }
            break
          case 'lte':
            delete entry[key2]
            entry = {
              ...entry,
              $lte: op,
            }
            break
          default:
            throw new Error(`Unknown operator: ${op}`)
        }
      }
      delete filter[key]
      filter[key] = entry
    }
  }

  return filter
}

const MongoCompiler = () => ({
  filter: ((filter) => filterImpl(filter)) as DatabaseMongoCompiler['filter'],
})

export { MongoCompiler }
