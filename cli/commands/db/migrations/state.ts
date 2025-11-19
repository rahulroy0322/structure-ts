import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import type {
  ColumnSchemaType,
  IndexSchemaType,
  StateType,
} from '../../../@types/migrations.types'
import type { ModelType } from '../../../@types/model.types'

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
      (acc, [key, { type, unique, ...props }]) => {
        acc.columns.push({
          key,
          type,
          ...props,
        } as any)

        if (unique || type === 'pk') {
          acc.indexes.push({
            key,
            name: `idx-${table}:${key}`,
            unique: true,
            pk: type === 'pk',
          })
        }

        return acc
      },
      {
        table,
        columns: [] as ColumnSchemaType[],
        indexes: [] as IndexSchemaType[],
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
