import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';

import type { MethodsType } from '.';

type QuestionType = {
  hostname: () => string;
  host: () => string;

  path: () => string;
  url: () => string;

  ip: () => string | undefined;
  method: () => MethodsType;
  headers: () => IncomingHttpHeaders;

  // eslint-disable-next-line no-unused-vars
  header: (name: string) => string | string[] | null;
  // eslint-disable-next-line no-unused-vars
  get: (name: string) => string | string[] | null;

  cookies: () => Record<string, string> | null;
  query: () => Record<string, string | number | boolean>;

  type: () => string;
  contentType: () => string;

  body: () => Promise<{
    body: Record<string, unknown>;
    files: Record<string, unknown>;
  }>;
  raw: () => IncomingMessage;
};

export type { QuestionType };
