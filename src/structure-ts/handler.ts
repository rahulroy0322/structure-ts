import type { IncomingMessage, ServerResponse } from 'node:http';

import type { ReplyType } from '../@types';
import { Question } from './question/main';
import { Reply } from './reply';
import type { Handler } from './router';
import { internalServerError, notFound } from './status';

const handler =
  <T>(handel: ReturnType<typeof Handler<T>>['handel']) =>
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>): void => {
    const reply = Reply(res);
    const question = Question(req);

    const handlerReply = handel(question, reply as ReplyType<T>);

    if (handlerReply.success) {
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
