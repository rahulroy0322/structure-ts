import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';

import type { MethodsType, QuestionType } from '../../@types';
import { getTransformedBody } from './body';
import { parseCookie } from './cookie';
import { parsePath } from './path';
import { getQuery } from './query';

const Question = (request: IncomingMessage): QuestionType => {
  const requestData = {} as {
    body: Record<string, unknown>;
    files: Record<string, unknown>;
  };

  const header = (name: string): string | string[] | null => {
    name = name.toLowerCase();

    const header = request.headers[name];

    if (!header) {
      return null;
    }
    return header;
  };
  const get = header;

  const contentType = (): string => header('content-type') as string;
  const type = contentType;

  const host = (): string => get('host') as string;
  const hostname = host;

  const url = (): string => request.url!;

  const ip = (): string | undefined => request.socket.remoteAddress;
  const method = (): MethodsType =>
    (request.method || 'get').toLowerCase() as MethodsType;

  const headers = (): IncomingHttpHeaders => request.headers;
  const query = (): Record<string, string | number | boolean> =>
    getQuery(request);

  const cookies = (): Record<string, string> | null => {
    const { cookie } = request.headers;

    if (!cookie) {
      return null;
    }

    return parseCookie(cookie);
  };

  const path = (): string => {
    const _path = url();

    if (_path) {
      return parsePath(_path).pathname || '/';
    }

    return _path;
  };

  const body = async () => {
    // eslint-disable-next-line
    if (!requestData.body !== undefined) {
      const { body, files } = await getTransformedBody(request);

      requestData.body = body;
      requestData.files = files;
    }

    return {
      body: requestData.body,
      files: requestData.files,
    };
  };

  const raw = (): IncomingMessage => request;

  return {
    hostname,
    host,

    path,
    url,

    ip,
    method,
    headers,

    header,
    get,

    cookies,
    query,

    type,
    contentType,

    body,
    raw,
  } satisfies QuestionType;
};

export { Question };
