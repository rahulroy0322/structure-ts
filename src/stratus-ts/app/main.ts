import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

import type { ReadOnlyRouterRoutesType, RouterRoutesType } from '../../@types'
import { BASE_DIR, SETTINGS } from '../settings/main'
import { checkRoute } from './routes/main'

const REQUIRED_FILES = ['routes', 'controllers'] as const

const checkRequiredFiles = (app: string, files: string[]) =>
  REQUIRED_FILES.forEach((file) => {
    if (!files.includes(file)) {
      throw new Error(`"${file}" file does not exists at "${app}" app!`)
    }
  })

const getAppAllFiles = async (app: string) => {
  const appPath = path.join(BASE_DIR, app)

  if (!existsSync(appPath)) {
    throw new Error(`app "${app}" does not exists!`)
  }

  return (await readdir(appPath)).map((file) =>
    file.replace('.ts', '').replace('.js', '')
  )
}

const checkApps = async () => {
  if (!SETTINGS) {
    console.error('please run the project properly -> "checkApps" is called')

    process.exit(1)
  }

  const { APPS } = SETTINGS

  const routes: ReadOnlyRouterRoutesType<unknown> = (
    await Promise.all(
      APPS.map(async (app) => {
        try {
          checkRequiredFiles(app, await getAppAllFiles(app))

          const routes = await checkRoute(app)
          return routes
        } catch (err) {
          console.error(err)
          process.exit(1)
        }
      })
    )
  ).reduce(
    (acc, curr) => {
      if (curr.main) {
        acc.main = {
          ...acc.main,
          ...curr.main,
        }
      }

      if (curr.dynamic) {
        ;(acc.dynamic as RouterRoutesType<unknown>['dynamic']).push(
          ...curr.dynamic
        )
      }

      return acc
    },
    {
      dynamic: [],
      main: {},
    }
  )

  return routes
}

export { checkApps }
