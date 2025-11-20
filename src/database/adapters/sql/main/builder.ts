import type { SqlBuilderType } from '../../../../@types/database/sql/builder.types'
import { SQLCompiler } from './compiler'

const SQLBuilder = (): SqlBuilderType => {
  const compiler = SQLCompiler()

  const create: SqlBuilderType['create'] = (
    table,
    data,
    // @ts-expect-error
    projection = {}
  ) => {
    const columns = compiler.columns(data[0] as Record<string, unknown>)
    const [placeHolders, valueParams] = compiler.values(data)

    const parts = [
      'INSERT',
      'INTO',
      table,
      `(${columns})`,
      'VALUES',
      `${placeHolders.map((p) => `(${p.join(',')})`).join(',')}`,
    ]

    parts.push(
      'RETURNING',
      !Object.keys(projection).length
        ? '*'
        : compiler.columns({
            ...projection,
            _id: true,
          })
    )

    return [parts.join(' '), valueParams]
  }

  const find: SqlBuilderType['find'] = (
    table,
    filter = {},
    // @ts-expect-error
    projection = {},
    options = {}
  ) => {
    const columns = !Object.keys(projection).length
      ? '*'
      : compiler.columns({
          ...projection,
          _id: true,
        })

    const params: unknown[] = []

    const parts = ['SELECT', columns, 'FROM', table]

    if (Object.keys(filter).length) {
      const [filterSql, filterParams] = compiler.filter(filter)

      parts.push('WHERE', filterSql)
      params.push(...filterParams)
    }

    if (Object.keys(options).length) {
      const [optionsSql, optionsParams] = compiler.options(
        params.length,
        options
      )

      parts.push(optionsSql)
      params.push(...optionsParams)
    }

    return [parts.join(' '), params]
  }

  const update: SqlBuilderType['update'] = (
    table,
    filter,
    data,
    // @ts-expect-error
    projection = {}
  ) => {
    const [updateSql, updateParams] = compiler.update(data)

    let params: unknown[] = updateParams

    const parts = ['UPDATE', table, 'SET', updateSql]

    if (Object.keys(filter || {}).length) {
      const [filterSql, filterParams] = compiler.filter(filter, params)

      parts.push('WHERE', filterSql)
      params = filterParams
    }

    const columns = !Object.keys(projection).length
      ? '*'
      : compiler.columns({
          ...projection,
          _id: true,
        })

    parts.push('RETURNING', columns)

    return [parts.join(' '), params]
  }

  const destroy: SqlBuilderType['destroy'] = (table, filter, options = {}) => {
    const params: unknown[] = []

    const parts = ['DELETE', 'FROM', table]

    if (Object.keys(filter || {}).length) {
      const [filterSql, filterParams] = compiler.filter(filter)

      parts.push('WHERE', filterSql)
      params.push(...filterParams)
    }

    if (Object.keys(options).length) {
      const [optionsSql, optionsParams] = compiler.options(
        params.length,
        options
      )

      parts.push(optionsSql)
      params.push(...optionsParams)
    }

    parts.push('RETURNING', '*')

    return [parts.join(' '), params]
  }

  return {
    create,
    find,
    update,
    destroy,
  }
}

export { SQLBuilder }
