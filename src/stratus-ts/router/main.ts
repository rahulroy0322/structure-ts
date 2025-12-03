import { METHODS } from 'node:http'
import Joi from 'joi'

import type {
  ControllerOptionType,
  ControllerType,
  MethodsType,
  ReadOnlyRouterRoutesType,
  RouterMethodeType,
  RouterRoutesType,
} from '../../@types'
import { getCleanPath, getRegexpFromUrl } from './utils'

const methods = METHODS.map((method) => method.toLowerCase()) as MethodsType[]

const DELIMITER = '<'
const CATCH_ALL = '*'

const getType = (type: ControllerOptionType['body'][string]['type']) => {
  switch (type) {
    case 'string':
      return Joi.string()
    case 'email':
      return Joi.string().email()
    case 'number':
      return Joi.number()
    default:
      throw new TypeError(`unknown type "${type}"`)
  }
}

const getBodySchema = (option: ControllerOptionType['body']) => {
  const _schema = {} as Record<string, ReturnType<typeof getType>>
  for (const op in option) {
    // biome-ignore lint/style/noNonNullAssertion: it will exists
    const value = option[op]!
    const type = getType(value.type)
    _schema[op] = value.required ? type.required() : type
  }
  return Joi.object(_schema).required()
}

const Router = (baseUrl = '') => {
  const routes = {
    main: {},
    dynamic: [],
  } as RouterRoutesType

  const route: RouterMethodeType = {
    get: (path, handler, options) => _route(path, 'get', handler, options),
    post: (path, handler, options) => _route(path, 'post', handler, options),
    patch: (path, handler, options) => _route(path, 'patch', handler, options),
    put: (path, handler, options) => _route(path, 'put', handler, options),
    delete: (path, handler, options) =>
      _route(path, 'delete', handler, options),
    head: (path, handler, options) => _route(path, 'head', handler, options),
    options: (path, handler, options) =>
      _route(path, 'options', handler, options),
    connect: (path, handler, options) =>
      _route(path, 'connect', handler, options),
  }

  const _route = (
    path: string,
    methode: MethodsType,
    controller: ControllerType,
    options?: ControllerOptionType
  ) => {
    const notPresent = -1

    const bodySchema = options?.body ? getBodySchema(options.body) : null

    if (!methods.includes(methode)) {
      console.error('Methode Not Allowed!')
      process.exit()
    }

    path = getCleanPath(baseUrl, path)

    if (
      path.indexOf(DELIMITER) === notPresent &&
      path.indexOf(CATCH_ALL) === notPresent
    ) {
      if (!routes.main[path]) {
        routes.main[path] = {}
      }

      // biome-ignore lint/style/noNonNullAssertion: it will exists
      routes.main[path]![methode] = {
        controller,
        body: bodySchema,
      }

      return
    }

    const { regexp, keys } = getRegexpFromUrl(path)

    // [RegExp, KeyValType[], MethodsType, ControllerType]
    routes.dynamic.push([
      regexp,
      keys,
      methode,
      controller,
      {
        body: bodySchema,
      },
    ])
  }

  return {
    route,
    routes: routes as ReadOnlyRouterRoutesType,
    ...route,
  }
}

export { Router }
