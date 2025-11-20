const KEY = 'RETURNING'

const queryForReturnig = (
  sql: string,
  values: string[]
): {
  name: string
  condition: string
  values: string[]
  invert?: true
} | null => {
  // insert
  if (/insert\s+into\s+\D/gi.test(sql)) {
    const intoIndex = sql.toLowerCase().indexOf('into')

    const sqlParts = sql.substring(intoIndex).split(' ')

    const name = sqlParts[1]

    if (!name) {
      return null
    }

    const fields = /\(([^)]+)\)/gi.exec(
      sql.substring(intoIndex + (name || '').length)
    )

    if (!fields) {
      return null
    }

    const select = fields[1]?.trim()

    const _fields = select
      ?.replace(/`/gi, '')
      .split(',')
      .map((s) => s.trim())

    if (!_fields) {
      return null
    }

    const newValues: Record<string, string[]> = {}

    for (let i = 0; i < values.length; ) {
      for (let j = 0; j < _fields.length; j++) {
        const key = _fields[j] as string
        if (!newValues[key]) {
          newValues[key] = []
        }
        newValues[key].push(values[i + j] as string)
      }
      i += _fields.length
    }

    const sortedFields = _fields.sort()

    const formatedValues = sortedFields.flatMap((key) => {
      return newValues[key as keyof typeof newValues] as string[]
    })

    return {
      name,
      condition: sortedFields
        .map((key) => `${key} IN (${newValues[key]?.map(() => '?')})`)
        .join(' and '),
      values: formatedValues,
    }
  }

  // TODO!
  // update
  if (/update\s+\D/gi.test(sql)) {
    const updateIndex = sql.toLowerCase().indexOf('update')

    const sqlParts = sql.substring(updateIndex).split(' ')

    const name = sqlParts[1]

    if (!name) {
      return null
    }

    const fields = /WHERE\s*([a-zA-Z0-9=?`\s\n,()]*)\s*/gim.exec(sql)

    if (!fields) {
      return null
    }

    const where = fields[1]?.trim()

    const valuesRequired = (fields[1] || '').split('?').length - 1

    return {
      name,
      condition: where || '',
      values: values.slice(values.length - valuesRequired),
    }
  }

  // delete
  if (/delete\s+\D/gi.test(sql)) {
    const fromIndex = sql.toLowerCase().indexOf('from')

    const sqlParts = sql.substring(fromIndex).split(' ')

    const name = sqlParts[1]

    if (!name) {
      return null
    }

    const fields = /WHERE\s*([a-zA-Z0-9=?$`\s\n,()]*)\s*/gim.exec(sql)

    if (!fields) {
      return null
    }

    const where = fields[1]?.trim()

    return {
      name,
      condition: where || '',
      values,
      invert: true,
    }
  }

  if (/select/gi.test(sql)) {
    throw new Error(`select don't need any ${KEY}`)
  }

  return null
}

type _SqlType = {
  sql: string
  values: string[]
}

const query = (
  sql: string,
  values: string[]
):
  | {
      queries: [_SqlType, null]
      invert: false
    }
  | {
      queries: [_SqlType, _SqlType]
      invert: boolean
    }
  | null => {
  if (!new RegExp(KEY, 'ig').test(sql)) {
    return {
      queries: [
        {
          sql,
          values,
        },
        null,
      ],
      invert: false,
    }
  }

  let [_sql, select] = sql.split(KEY)

  if (!_sql || !select) {
    return null
  }

  select = select.replace(/;/gi, '')

  const data = queryForReturnig(_sql, values)

  if (!data) {
    return null
  }

  const { name, condition, values: newValues, invert = false } = data

  const parts = ['SELECT', select, 'FROM', name, 'WHERE', condition]

  const mainQuery = {
    sql: `${_sql};`,
    values: values,
  }

  const selectQuery = {
    sql: `${parts.join(' ')};`,
    values: newValues,
  }

  return {
    queries: [mainQuery, selectQuery],
    invert,
  }
}
export { query }
