import type { IncomingMessage, ServerResponse } from 'node:http';

import type {
  ErrorControllerType,
  ReplyType,
  ServerRespnsceType,
} from '../@types';
import { Question } from './question/main';
import { Reply } from './reply';
import type { Handler } from './router';
import { badRequest, internalServerError, notFound } from './status';

const handler =
  <T>(
    handel: ReturnType<typeof Handler<T>>['handel'],
    {
      baseDir,
      errorController,
      templateDir,
    }: {
      baseDir: string;
      errorController: ErrorControllerType<ServerRespnsceType>;
      templateDir: string;
    }
  ) =>
  async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ): Promise<void> => {
    const question = Question(req);
    const reply = Reply({
      baseDir,
      reply: res,
      errorController,
      templateDir,
      question,
    });

    const handlerReply = await handel(question, reply as ReplyType<T>);

    if (handlerReply.success) {
      return;
    }

    if (handlerReply.required) {
      reply.status(badRequest()).json({
        success: false,
        error: {
          name: 'validation failed!',
          message: handlerReply.required,
        },
      });
      return;
    }

    const route = question.path();

    if (handlerReply.notFound) {
      reply.status(notFound()).json({
        success: false,
        route,
        error: {
          name: 'NOT Found!',
          message: `the route "${route}" does not found!`,
        },
      });
      return;
    }

    const e = handlerReply.error;

    const error =
      e instanceof Error
        ? e
        : {
            name: 'Unknown Error',
            message: 'Internal Server Error',
          };

    // ! TODO check for server Error Handler
    reply.status(internalServerError()).json({
      success: false,
      route,
      error,
    });
  };

export { handler };
