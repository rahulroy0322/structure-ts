import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import type { StateType, TableSchemaType } from '../../@types/migrations.types'
import type { ModelType } from '../../@types/model.types'

const loadManeger = async (MANEGER_FILE: string): Promise<StateType> => {
  if (existsSync(MANEGER_FILE)) {
    const content = await readFile(MANEGER_FILE)
    return JSON.parse(content.toString()) as StateType
  }
  return {
    at: 0,
    tables: [],
    migrations: [],
  } satisfies StateType
}

const getNewState = (
  models: ModelType[],
  migrations: string[],
  name?: string
): StateType => {
  const tables = models.map(({ schema, table }) =>
    Object.entries(schema).reduce(
      (acc, [key, value]) => {
        acc.columns.push({
          key,
          ...value,
        } as any)

        return acc
      },
      {
        table,
        columns: [] as TableSchemaType['columns'],
      }
    )
  )

  const at = Date.now()

  if (!name) {
    name = at.toString()
  }

  migrations.push(name)

  return {
    tables,
    at,
    migrations,
  } satisfies StateType
}

export { loadManeger, getNewState }
