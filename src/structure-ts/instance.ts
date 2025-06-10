import http, {
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from 'node:http';

import type { ServerOptionsType } from '../@types';

const getServerInstance = (
  options: ServerOptionsType,
  /* eslint-disable no-unused-vars */
  handler: (
    qestion: IncomingMessage,
    reply: ServerResponse<IncomingMessage>
  ) => void
  /* eslint-enable no-unused-vars */
): Server => {
  const server = http.createServer(options, handler);

  if (options.requestTimeout) {
    server.setTimeout(options.requestTimeout);
  }

  if (options.keepAliveTimeout) {
    server.keepAliveTimeout = options.keepAliveTimeout;
  }

  return server;
};

export { getServerInstance };
