import path from 'node:path'

import type { ReadOnlyRouterRoutesType } from '../../../@types'
import { BASE_DIR } from '../../settings/main'
import { routeSchema } from './schema'

const ERROR_EXIT_CODE = 1

const checkRoute = async <T>(app: string) => {
  const { default: routes } = await import(
    path.relative(__dirname, path.join(BASE_DIR, app, 'routes'))
  )

  const { error, warning } = routeSchema.validate(routes, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  })

  if (error) {
    console.error(`invalid app "${app}"!`)
    console.error(error)
    process.exit(ERROR_EXIT_CODE)
  }

  if (warning) {
    console.warn(warning)
  }

  return routes as ReadOnlyRouterRoutesType<T>
}

export { checkRoute }
