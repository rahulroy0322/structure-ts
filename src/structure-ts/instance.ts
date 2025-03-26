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
): Server => http.createServer(options, handler);

export { getServerInstance };
