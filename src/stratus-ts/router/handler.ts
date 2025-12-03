import type { ObjectSchema } from 'joi'

import type {
  ControllerType,
  HandlerReturnType,
  MethodsType,
  QuestionType,
  ReadOnlyRouterRoutesType,
  ReplyType,
  ServerRespnsceType,
} from '../../@types'
import { getCleanResponseUrl, getParams } from './utils'

const Handler = ({ main: routes, dynamic }: ReadOnlyRouterRoutesType) => {
  type ControllerReturnType = {
    controller: ControllerType
    body: ObjectSchema | null
  }

  type ControllerWithParamsReturnType = ControllerReturnType & {
    _params: Record<string, unknown>
  }

  const getControllerForUrl = (
    url: string,
    method: MethodsType
  ): ControllerReturnType | false => {
    if (!routes[url]) {
      return false
    }
    const route = routes[url]

    return route[method.toLowerCase() as MethodsType] || false
  }

  const getControllerForDynamicUrl = (
    url: string,
    method: MethodsType
  ): ControllerWithParamsReturnType | boolean => {
    const urlIndex = 0
    const methodIndex = 2
    method = method.toLowerCase() as MethodsType

    for (const route of dynamic) {
      if (!route[urlIndex].test(url)) {
        continue
      }
      if (route[methodIndex].toLowerCase() !== method) {
        continue
      }
      const [regexp, keys, , controller, { body }] = route

      const params = getParams(
        {
          regexp,
          keys,
        },
        url
      )

      return params === false ? true : { controller, body, _params: params }
    }

    return false
  }

  const getController = (
    url: string,
    method: MethodsType
  ): ControllerWithParamsReturnType | false => {
    const controller = getControllerForUrl(url, method)

    if (controller && (controller as ControllerReturnType).controller) {
      return {
        ...controller,
        _params: {},
      } satisfies ControllerWithParamsReturnType
    }
    const dynamicController = getControllerForDynamicUrl(url, method)

    if (
      dynamicController &&
      (dynamicController as ControllerWithParamsReturnType).controller
    ) {
      return dynamicController as ControllerWithParamsReturnType
    }

    if (dynamicController === true) {
      throw new Error('something went wrong')
    }

    return false
  }

  const handleImpl = async (
    question: QuestionType,
    reply: ReplyType<ServerRespnsceType>
  ): Promise<HandlerReturnType> => {
    const method = question.method()

    const url = getCleanResponseUrl(question.url() || '/')

    try {
      const res = getController(url, method)

      if (res === false) {
        return {
          success: false,
          notFound: true,
        }
      }

      const { body, controller, _params } = res

      if (body) {
        const { body: _body } = await question.body()
        const { error } = body.validate(_body)
        if (error) {
          return {
            success: false,
            required: error.details.map((value) => value.message).join('\n'),
          }
        }
      }

      if (_params && (question as any).request) {
        Object.assign((question as any).request, {
          _params,
        })
      }

      controller(question, reply)

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  const handel = async (
    qestion: QuestionType,
    reply: ReplyType<ServerRespnsceType>
  ): Promise<HandlerReturnType> => await handleImpl(qestion, reply)

  return {
    handel,
  }
}

export { Handler }
