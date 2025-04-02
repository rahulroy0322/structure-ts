import type { ServerOptionsType, ServerRespnsceType } from '../@types';
import { main } from '../db/main';
import { checkApps } from './app';
import { DEFAULT_OPTIONS } from './config';
import { ERROR_EXIT_CODE, SUCCESS_EXIT_CODE } from './constents';
import { handler } from './handler';
import { getServerInstance } from './instance';
import { Handler } from './router';
import SETTINGS from './settings';

const { PORT } = SETTINGS;

const Structure = async <T = ServerRespnsceType>(
  opts: ServerOptionsType = DEFAULT_OPTIONS
) => {
  await main();
  const routes = await checkApps<T>();

  const { handel } = Handler<T>(routes);

  let isListening = false;

  // eslint-disable-next-line no-unused-vars
  const listen = (cb?: (port: number) => void) => {
    const server = getServerInstance(opts, handler(handel));

    if (opts.requestTimeout) {
      server.setTimeout(opts.requestTimeout);
    }

    if (opts.keepAliveTimeout) {
      server.keepAliveTimeout = opts.keepAliveTimeout;
    }

    const close = () => {
      server.closeAllConnections();
      server.close(onClose);
    };

    if (isListening) {
      console.error('App is Already listening');
      close();
    }

    isListening = true;
    server.listen(PORT);
    cb?.(PORT);
    return close;
  };

  return {
    listen,
  };
};

const onClose = (e: Error | undefined) => {
  if (e) {
    //TODO: Debug for error
    process.exit(ERROR_EXIT_CODE);
  }
  process.exit(SUCCESS_EXIT_CODE);
};

export { Structure };
export default Structure;
