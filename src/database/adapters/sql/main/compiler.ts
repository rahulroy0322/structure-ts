import type { DatabaseSQLCompiler } from '../../../../@types/database/sql/compiler.types'
import type { InferSchemaModelType } from '../../../../@types/model/field.types'
import type {
  FilterKeysModelType,
  FilterModelType,
} from '../../../../@types/model/filter.types'
import type { SchemaType } from '../../../../@types/model/utils.types'

const filterImpl = <S extends SchemaType>(
  filter: Partial<FilterModelType<S>>,
  params: string[] = []
): [string, string[]] => {
  const parts: string[] = []

  const eq = (key: string, value: string) => {
    parts.push(`${key} = $${params.length + 1}`)
    params.push(value)
  }

  const entries = Object.entries(filter)

  for (const [key, entry] of entries) {
    if (key === 'OR' || key === 'AND') {
      const op = key === 'OR' ? 'OR' : 'AND'

      const sub = (entry as unknown as InferSchemaModelType<SchemaType>[]).map(
        (v) => `(${filterImpl(v, params)[0]})`
      )

      parts.push(sub.join(` ${op} `))
      continue
    }

    if (typeof entry === 'object') {
      for (const [key2, op] of Object.entries(entry)) {
        switch (key2 as FilterKeysModelType<S>) {
          case 'in':
            parts.push(
              `${key} IN (${(op as unknown[]).map((value) => {
                params.push(value as string)
                return `$${params.length}`
              })})`
            )
            break
          case 'nin':
            parts.push(
              `${key} NOT IN (${(op as unknown[]).map((value) => {
                params.push(value as string)
                return `$${params.length}`
              })})`
            )
            break
          case 'eq':
            eq(key, op as string)
            break
          case 'ne':
            parts.push(`${key} != $${params.length + 1}`)
            params.push(op as string)
            break
          case 'startsWith':
            parts.push(`${key} LIKE $${params.length + 1}`)
            params.push(`%${op}`)
            break
          case 'endsWith':
            parts.push(`${key} LIKE $${params.length + 1}`)
            params.push(`${op}%`)
            break
          case 'like':
          case 'ilike':
            parts.push(`${key} LIKE $${params.length + 1}`)
            params.push(`%${op}%`)
            break
          case 'bt':
            parts.push(
              `${key} BETWEEN $${params.length + 1} AND $${params.length + 1}`
            )
            params.push(...(op as []))
            break
          case 'gt':
            parts.push(`${key} > $${params.length + 1}`)
            params.push(op as string)
            break
          case 'lt':
            parts.push(`${key} < $${params.length + 1}`)
            params.push(op as string)
            break
          case 'gte':
            parts.push(`${key} >= $${params.length + 1}`)
            params.push(op as string)
            break
          case 'lte':
            parts.push(`${key} <= $${params.length + 1}`)
            params.push(op as string)
            break
          default:
            throw new Error(`Unknown operator: ${op}`)
        }
      }

      continue
    }

    // the end case
    eq(key, entry as unknown as string)
  }

  return [parts.join(' AND '), params]
}

const SQLCompiler = (): DatabaseSQLCompiler => {
  const filter: DatabaseSQLCompiler['filter'] = (filter, params = []) => {
    return filterImpl(filter, params as string[])
  }

  const select: DatabaseSQLCompiler['select'] = (fields = {}) => {
    const entries = Object.entries(fields)

    if (!entries.length) {
      return '*'
    }

    return columns(fields)
  }

  const options: DatabaseSQLCompiler['options'] = (
    whereParamsLength,
    options
  ) => {
    const parts: string[] = []
    const params: (string | number)[] = []

    if (options.orderBy) {
      const orderByFields = Object.keys(options.orderBy)

      parts.push('ORDER', 'BY')

      if (orderByFields.length) {
        const _orderFields: string[] = []
        for (const key of orderByFields) {
          _orderFields.push(
            `${key.toString()} ${
              options.orderBy[key] === 'ASC' ? 'ASC' : 'DESC'
            }`
          )
        }
        parts.push(_orderFields.join(','))
      }
    }

    if (options.limit) {
      parts.push(`LIMIT $${whereParamsLength + params.length + 1}`)
      params.push(options.limit)

      if (options.skip) {
        parts.push(`OFFSET $${whereParamsLength + params.length + 1}`)
        params.push(options.skip)
      }
    }

    return [parts.join(' '), params]
  }

  const values: DatabaseSQLCompiler['values'] = (data) => {
    const params: unknown[] = []
    const placeHolders: string[][] = []

    data.forEach((_data) => {
      const _placeHolders: string[] = []

      Object.values(_data).forEach((value) => {
        _placeHolders.push(`$${params.length + 1}`)
        params.push(value)
      })
      placeHolders.push(_placeHolders)
    })

    return [placeHolders, params] as const
  }

  const update: DatabaseSQLCompiler['update'] = (data) => {
    const params: unknown[] = []
    const keys: string[] = []

    Object.entries(data).forEach(([key, value]) => {
      keys.push(`${key} = $${params.length + 1}`)
      params.push(value)
    })

    return [keys.join(', '), params]
  }

  const columns: DatabaseSQLCompiler['columns'] = (obj) =>
    Object.keys(obj)
      .filter((key) => obj[key])
      .join(',')

  return {
    filter,
    select,
    options,
    columns,
    update,
    values,
  }
}

export { SQLCompiler }
