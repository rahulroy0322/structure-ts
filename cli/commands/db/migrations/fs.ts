import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import type { StateType } from '../../../@types/migrations.types'

const removeUnnesesoryNewLine = (text: string) => {
  return text.trim().replace(/\n\n/gi, '\n').replace(/\n\n/gi, '\n')
}

const saveManeger = async (MANEGER_FILE: string, state: StateType) =>
  await writeFile(MANEGER_FILE, JSON.stringify(state))

const saveSql = async (SQL_DIR: string, path: string, sql: string) => {
  const _path = `${SQL_DIR}/${path}.sql`

  if (!existsSync(SQL_DIR)) {
    await mkdir(_path)
  }

  await writeFile(_path, removeUnnesesoryNewLine(sql))
  return path
}

export { saveSql, saveManeger }
