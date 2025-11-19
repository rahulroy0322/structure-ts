import { existsSync } from 'node:fs'
import path from 'node:path'
import type { ModelType } from '../../../@types/model.types'
import type { SettingsType } from '../../../@types/settings.types'
import { error } from '../../../utils'
import { getMigrationConfig } from './config'
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
  const srcDir = path.join(cwd, 'src')

  const name = formatName(commands.at(0))

  const settingsPath = path.join(srcDir, 'settings.ts')

  if (!existsSync(settingsPath)) {
    error(
      `invalid dir please go to your project dir and the try to run migration generation command`
    )
    process.exit(1)
  }

  const { APPS, MIGRATION } = (await import(settingsPath))
    .default as SettingsType

  const models = await getModels(cwd, APPS)

  await make(cwd, models, getMigrationConfig(MIGRATION), name)

  return error('this should not be called')
}

export { migration }
