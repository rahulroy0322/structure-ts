import type { ErrorControllerType, ServerRespnsceType } from '../../@types'
import { internalServerError } from '../status/main'

const errorController: ErrorControllerType<ServerRespnsceType> = (
  e,
  question,
  reply
) => {
  const route = question.path()

  const error =
    e instanceof Error
      ? {
          name: e.name,
          message: e.message,
        }
      : {
          name: 'Unknown Error',
          message: 'Internal Server Error',
        }

  if (reply.code().toString().startsWith('2')) {
    reply.status(internalServerError())
  }

  reply.json({
    success: false,
    route,
    error,
  })
}

export { errorController }
