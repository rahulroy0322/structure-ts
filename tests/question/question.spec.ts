import type { IncomingMessage } from 'node:http'
import type { Socket } from 'node:net'
import { Readable } from 'node:stream'
import { assert, describe, it } from 'vitest'
import { Question } from '../../src/stratus-ts/question/main'

const createMockRequest = (
  {
    method,
    headers,
    url,
    socket,
  }: {
    method?: string
    headers?: { host?: string; cookie?: string; 'content-type'?: string }
    url?: string
    socket?: { remoteAddress: string }
  } = { headers: {} },
  body: string[] = ['']
): IncomingMessage => {
  const stream = new Readable({
    read() {
      for (const part of body) {
        this.push(part)
      }
      this.push(null)
    },
  }) as IncomingMessage

  stream.method = method
  stream.url = url
  stream.headers = headers!
  stream.socket = socket as unknown as Socket

  return stream
}

describe('# Question', () => {
  describe('# basic Question', () => {
    it('# should return correct basic properties', () => {
      const req = createMockRequest({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          host: 'localhost:3000',
        },
        url: '/api/test',
        // TODO
        socket: { remoteAddress: '127.0.0.1' }, // have to support socket in future
      })
      const q = Question(req)

      assert.strictEqual(q.method(), 'post')
      assert.strictEqual(q.host(), 'localhost:3000')
      assert.strictEqual(q.hostname(), 'localhost:3000')
      assert.strictEqual(q.url(), '/api/test')
      assert.strictEqual(q.type(), 'application/json')
      assert.strictEqual(q.contentType(), 'application/json')
      assert.strictEqual(q.ip(), '127.0.0.1')
      assert.deepStrictEqual(q.headers(), req.headers)
      assert.strictEqual(q.get('host'), 'localhost:3000')
      assert.strictEqual(q.header('content-type'), 'application/json')
    })

    it('# should parse cookies', () => {
      const req = createMockRequest({
        headers: {
          cookie: 'token=abc123; user=test',
        },
      })
      const q = Question(req)

      assert.deepStrictEqual(q.cookies(), {
        token: 'abc123',
        user: 'test',
      })
    })

    it('# should parse query', () => {
      const req = createMockRequest({
        url: '/api/test?id=10&sort=asc',
      })
      const q = Question(req)

      assert.deepStrictEqual(q.query(), {
        id: 10,
        sort: 'asc',
      })
    })

    it('# should parse path from URL', () => {
      const req = createMockRequest({
        url: '/api/test',
      })
      const q = Question(req)

      assert.strictEqual(q.path(), '/api/test')
    })
  })

  describe('# advence Question', () => {
    it('# should return parsed body and files from getTransformedBody()', async () => {
      const req = createMockRequest(
        {
          headers: {
            'content-type': 'application/json',
          },
        },
        [JSON.stringify({ hello: 'world' })]
      )

      const q = Question(req)
      const result = await q.body()

      assert.deepStrictEqual(result.body, { hello: 'world' })
      assert.deepStrictEqual(result.files, {})

      const result2 = await q.body()
      assert.deepStrictEqual(result2, result)
    })
  })
})
