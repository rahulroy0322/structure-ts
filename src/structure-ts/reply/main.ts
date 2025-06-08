import type { IncomingMessage, ServerResponse } from 'node:http';

import type {
  CookieOptions,
  ErrorControllerType,
  QuestionType,
  ReplyType,
  ServerRespnsceType,
} from '../../@types';
import { ERROR_EXIT_CODE } from '../constents';
import { ok } from '../status';
import { stringify } from '../utils';
import { setCookie } from './cookie';
import { renderImpl } from './render';

const Reply = <T = ServerRespnsceType>({
  baseDir,
  reply,
  question,
  templateDir,
  errorController,
}: {
  baseDir: string;
  question: QuestionType;
  errorController: ErrorControllerType<ServerRespnsceType>;
  templateDir: string;
  reply: ServerResponse<IncomingMessage>;
}): ReplyType<T> => {
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

  const write = (body: unknown): void => {
    if (!get('Content-Type')) {
      type('text/plain');
    }

    reply.removeHeader('transfer-encoding');
    // reply.removeHeader('date')
    // reply.removeHeader('connection')

    reply.write(body);
    reply.end();
  };

  const jsonp = (data: unknown): void => {
    const body = Buffer.from(stringify(data));

    if (!get('Content-Type')) {
      type('application/json');
    }

    write(body);
  };

  const send = (body: unknown): void => {
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

  const render = (template: string, data?: Record<string, unknown>) => {
    try {
      const html = renderImpl(templateDir, template, data);
      status(ok()).type('text/html');
      write(html);
    } catch (e) {
      if (baseDir === 'src') {
        console.error(e);
      }
      errorController(e, question, res as ReplyType<unknown>);
    }
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

    render,

    cookie,
  } satisfies ReplyType<T>;

  Object.assign(res, {
    raw: reply,
  });
  return res;
};

export { Reply };
