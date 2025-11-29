import { assert, describe, it } from 'vitest'
import type {
  ControllerType,
  QuestionType,
  ReadOnlyRouterRoutesType,
  ReplyType,
} from '../../src/main'
import { Handler } from '../../src/stratus-ts/router/handler'

const controller: ControllerType = (_question, reply) => {
  reply.send('hello world')
}

const mockRoutes = {
  main: {
    '/': {
      get: {
        body: null,
        controller,
      },
    },

    '/users': {
      get: {
        body: null,
        controller,
      },
    },
  },
  dynamic: [
    [
      /^\/dynamic\/([0-9]+)$/,
      [
        {
          kind: 'param',
          translator: (val) => String(val),
          key: 'id',
        },
      ],
      'get',
      controller,
      { body: null },
    ],
  ],
} satisfies ReadOnlyRouterRoutesType<unknown>

describe('# Handler', () => {
  describe('# Static routes', () => {
    it('# should handle static route successfully', async () => {
      const handler = Handler(mockRoutes)

      const question = {
        method: () => 'GET',
        url: () => '',
        body: async () => null,
      } as unknown as QuestionType
      const reply = { send: (message) => message } as ReplyType<unknown>

      const result = await handler.handel(question, reply)

      assert.strictEqual(result.success, true, 'Expected successful response')
    })

    it('should return 404 for unknown route', async () => {
      const handler = Handler(mockRoutes)

      const question = {
        method: () => 'GET',
        url: () => '/unknown-route',
        body: async () => null,
      } as unknown as QuestionType
      const reply = { send: (message) => message } as ReplyType<unknown>

      const result = await handler.handel(question, reply)

      assert.strictEqual(result.success, false, 'Expected failure response')
      assert.strictEqual(
        (result as any).notFound,
        true,
        'Expected notFound flag to be true'
      )
    })
  })

  describe('# Static routes', () => {
    it('should handle dynamic route correctly', async () => {
      const handler = Handler(mockRoutes)

      const question = {
        method: () => 'GET',
        url: () => '/dynamic/123',
        body: async () => null,
      } as unknown as QuestionType
      const reply = { send: (message) => message } as ReplyType<unknown>

      const result = await handler.handel(question, reply)

      assert.strictEqual(result.success, true, 'Expected successful response')
    })
  })
})
