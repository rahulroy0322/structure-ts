import assert from 'node:assert';
import { describe, it } from 'node:test';

import type {
  QuestionType,
  ReadOnlyRouterRoutesType,
  ReplyType,
} from '../../src/@types';
import { Handler } from '../../src/structure-ts/router/handler';

const mockRoutes = {
  '/test-route': {
    GET: { controller: (question, reply) => reply.send('Success'), body: null },
  },
} as ReadOnlyRouterRoutesType<unknown>['main'];

const mockDynamicRoutes = [
  [
    /\/dynamic\/(\d+)/,
    [
      {
        key: 'id',
        kind: 'param',
        translator(val) {
          return Number(val);
        },
      },
    ],
    'get',
    (question, reply) => reply.send(`Dynamic route with id ${question}`),
    { body: null },
  ],
] satisfies ReadOnlyRouterRoutesType<unknown>['dynamic'];

describe('#Handler', () => {
  it('should handle static route successfully', async () => {
    const handler = Handler({ main: mockRoutes, dynamic: [] });

    const question = {
      method: () => 'GET',
      url: () => '/test-route',
      // eslint-disable-next-line require-await
      body: async () => null,
    } as unknown as QuestionType;
    const reply = { send: (message) => message } as ReplyType<unknown>;

    const result = await handler.handel(question, reply);

    assert.strictEqual(result.success, true, 'Expected successful response');
  });

  it('should return 404 for unknown route', async () => {
    const handler = Handler({ main: mockRoutes, dynamic: [] });

    const question = {
      method: () => 'GET',
      url: () => '/unknown-route',
      // eslint-disable-next-line require-await
      body: async () => null,
    } as unknown as QuestionType;
    const reply = { send: (message) => message } as ReplyType<unknown>;

    const result = await handler.handel(question, reply);

    assert.strictEqual(result.success, false, 'Expected failure response');
    assert.strictEqual(
      result.notFound,
      true,
      'Expected notFound flag to be true'
    );
  });

  it('should handle dynamic route correctly', async () => {
    const handler = Handler({ main: {}, dynamic: mockDynamicRoutes });

    const question = {
      method: () => 'GET',
      url: () => '/dynamic/123',
      // eslint-disable-next-line require-await
      body: async () => null,
    } as unknown as QuestionType;
    const reply = { send: (message) => message } as ReplyType<unknown>;

    const result = await handler.handel(question, reply);

    assert.strictEqual(result.success, true, 'Expected successful response');
  });
});
