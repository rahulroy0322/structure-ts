import type { IncomingMessage } from 'node:http';

import { getRequestBody } from '.';

const getJsonBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  const body = await getRequestBody(req);

  return JSON.parse(body.toString());
};

export { getJsonBody };
