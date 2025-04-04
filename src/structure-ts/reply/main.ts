import type { IncomingMessage, ServerResponse } from 'node:http';

import type {
  CookieOptions,
  ReplyType,
  ServerRespnsceType,
} from '../../@types';
import { ERROR_EXIT_CODE } from '../constents';
import { stringify } from '../utils';
// import { stringify } from "../utils";
import { setCookie } from './cookie';

const Reply = <T = ServerRespnsceType>(
  reply: ServerResponse<IncomingMessage>
): ReplyType<T> => {
  // TODO:
  const get = (field: string) => {
    const header = reply.getHeader(field);
    return header;
  };

  const header = (field: string, val: unknown): ReplyType<T> => {
    const value = Array.isArray(val) ? val.map(String) : String(val);

    if (field.toLowerCase() === 'content-type') {
      if (Array.isArray(value)) {
        throw new TypeError('Content-Type cannot be set to an Array');
      }
    }

    if (reply.writableEnded) {
      console.error('some event does not handled properly at', reply.req.url);
      process.exit(ERROR_EXIT_CODE);
    }

    reply.setHeader(field, value);
    return res;
  };
  const set = header;

  const type = (type: string): ReplyType<T> => {
    const notPresent = -1;

    const ct =
      type.indexOf('/') === notPresent ? 'application/octet-stream' : type;

    return set('Content-Type', ct);
  };
  const contentType = type;

  const status = (code: number): ReplyType<T> => {
    const statusCodeStart = 100;
    const statusCodeEnd = 999;

    if (!Number.isInteger(code)) {
      throw new TypeError(
        `Invalid status code: ${JSON.stringify(code)}. Status code must be an integer.`
      );
    }
    if (code < statusCodeStart || code > statusCodeEnd) {
      throw new RangeError(
        `Invalid status code: ${JSON.stringify(code)}. Status code must be greater than 99 and less than 1000.`
      );
    }

    reply.statusCode = code;
    return res;
  };
  const json = (data: T): void => {
    type('application/json');

    jsonp(data);
  };

  const jsonp = (data: unknown): void => {
    const body = Buffer.from(stringify(data));

    if (!get('Content-Type')) {
      type('application/json');
    }

    reply.removeHeader('transfer-encoding');
    // reply.removeHeader('date')
    // reply.removeHeader('connection')

    reply.write(body);
    reply.end();
  };

  const send = (body: unknown): void => {
    if ((body !== null || body !== undefined) && typeof body === 'object') {
      return json(body as T);
    }

    if (Buffer.isBuffer(body)) {
      if (!get('Content-Type')) {
        type('bin');
      }
      return jsonp(body);
    }

    jsonp(body);
  };

  const cookie = (
    name: string,
    value: string,
    option?: CookieOptions
  ): ReplyType<T> => {
    setCookie(reply)(name, value, option);
    return res;
  };

  const res: ReplyType<T> = {
    get,
    set,
    json,
    send,
    status,

    header,
    type,
    contentType,

    cookie,
  } satisfies ReplyType<T>;

  return res;
};

export { Reply };
