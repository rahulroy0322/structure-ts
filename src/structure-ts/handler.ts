import type { IncomingMessage, ServerResponse } from 'node:http';

import type {
  ControllerType,
  ErrorControllerType,
  ReplyType,
  ServerRespnsceType,
} from '../@types';
import { Question } from './question/main';
import { Reply } from './reply';
import type { Handler } from './router';
import { badRequest } from './status';

const handler =
  <T>(
    handel: ReturnType<typeof Handler<T>>['handel'],
    {
      baseDir,
      errorController,
      notFoundController,
      templateDir,
    }: {
      baseDir: string;
      errorController: ErrorControllerType<ServerRespnsceType>;
      notFoundController: ControllerType<ServerRespnsceType>;
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
      reply.status(badRequest());
      errorController(
        {
          name: 'validation failed!',
          message: handlerReply.required,
        },
        question,
        reply
      );
      return;
    }

    if (handlerReply.notFound) {
      notFoundController(question, reply);
      return;
    }

    errorController(handlerReply.error, question, reply);
  };

export { handler };
