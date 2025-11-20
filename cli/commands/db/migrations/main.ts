import { existsSync } from 'node:fs'
import path from 'node:path'
import type { ModelType } from '../../../@types/model.types'
import type { SettingsType } from '../../../@types/settings.types'
import { error } from '../../../utils'
import { getSettings } from '../utils'
import { make } from './make'

const formatName = (name: string | undefined) => {
  if (!name) {
    return
  }

  if (!/^[a-zA-Z\d]+/gi.test(name)) {
    for (const char of name) {
      if (/[a-zA-z]/i.test(char)) {
        break
      }

      // remove other then a-z char at first
      name = name?.substring(1)
    }

    return name
  }

  return name
}

const getModels = async (cwd: string, APPS: SettingsType['APPS']) => {
  const srcDir = path.join(cwd, 'src')

  return (
    await Promise.all(
      APPS.map(async (app) => {
        const modelsPath = path.join(srcDir, app, 'models.ts')

        if (!existsSync(modelsPath)) {
          return
        }

        const res = (await import(modelsPath)) as Record<string, ModelType>

        if (res.default) {
          return Object.values(res.default)
        }

        return Object.values(res)
      })
    )
  )
    .filter((models) => Boolean(models))
    .flat() as ModelType[]
}

const migration = async (commands: string[], cwd: string) => {
  const { APPS, MIGRATION } = await getSettings(cwd)
  const models = await getModels(cwd, APPS)

  const name = formatName(commands.at(0))

  await make(cwd, models, MIGRATION, name)

  return error('this should not be called')
}

export { migration }
