import type { IncomingMessage, ServerResponse } from 'node:http'

import type { ControllerType, ErrorControllerType } from '../@types'
import { Question } from './question/main'
import { Reply } from './reply/main'
import type { Handler } from './router/handler'
import { badRequest } from './status/main'

const handler =
  (
    handel: ReturnType<typeof Handler>['handel'],
    {
      baseDir,
      errorController,
      notFoundController,
      templateDir,
    }: {
      baseDir: string
      errorController: ErrorControllerType
      notFoundController: ControllerType
      templateDir: string
    }
  ) =>
  async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ): Promise<void> => {
    const question = Question(req)
    const reply = Reply({
      baseDir,
      reply: res,
      errorController,
      templateDir,
      question,
    })

    const handlerReply = await handel(question, reply)

    if (handlerReply.success) {
      return
    }

    if (handlerReply.required) {
      reply.status(badRequest())
      errorController(
        {
          name: 'validation failed!',
          message: handlerReply.required,
        },
        question,
        reply
      )
      return
    }

    if (handlerReply.notFound) {
      notFoundController(question, reply)
      return
    }

    errorController(handlerReply.error, question, reply)
  }

export { handler }
