import type {
  ControllerType,
  ErrorControllerType,
  HandlerReturnType,
  QuestionType,
  ReplyType,
  ServerOptionsType,
  ServerRespnsceType,
} from '../@types';
import { handler } from './handler';
import { getServerInstance } from './instance';

const StructureImpl = <T = ServerRespnsceType>(
  {
    onClose,
    port,
    handel,

    baseDir,
    errorController,
    notFoundController,
    templateDir,
  }: {
    // eslint-disable-next-line no-unused-vars
    onClose: (e: Error | undefined) => void;
    port: number;
    handel: (
      // eslint-disable-next-line no-unused-vars
      qestion: QuestionType,
      // eslint-disable-next-line no-unused-vars
      reply: ReplyType<T>
    ) => Promise<HandlerReturnType>;

    baseDir: string;
    errorController: ErrorControllerType<ServerRespnsceType>;
    notFoundController: ControllerType<ServerRespnsceType>;
    templateDir: string;
  },
  serverOpts: ServerOptionsType
) => {
  let isListening = false;

  // eslint-disable-next-line no-unused-vars
  const listen = (cb?: (port: number) => void) => {
    const server = getServerInstance(
      serverOpts,
      handler(handel, {
        templateDir,
        errorController,
        notFoundController,
        baseDir,
      })
    );

    const close = () => {
      server.closeAllConnections();
      server.close(onClose);
    };

    if (isListening) {
      console.error('App is Already listening');
      close();
    }

    isListening = true;
    server.listen(port);
    cb?.(port);
    return close;
  };

  return {
    listen,
  };
};

export default StructureImpl;
