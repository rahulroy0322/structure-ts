import type { IncomingMessage } from 'node:http'
import { Readable } from 'node:stream'
import { assert, describe, it } from 'vitest'
import { getJsonBody } from '../../../src/stratus-ts/question/body/json'

const createMockRequest = (chunks: (string | Buffer)[]): IncomingMessage => {
  const stream = new Readable({
    read() {
      for (const chunk of chunks) {
        this.push(chunk)
      }
      this.push(null)
    },
  }) as IncomingMessage

  return stream
}

describe('# getJsonBody', () => {
  describe('# basic json string', () => {
    it('# should parse valid JSON body', async () => {
      const req = createMockRequest([JSON.stringify({ hello: 'world' })])
      const result = await getJsonBody(req)

      assert.deepStrictEqual(result, { hello: 'world' })
    })

    it('# should return empty object for invalid JSON', async () => {
      const req = createMockRequest(['{ invalid json'])
      const result = await getJsonBody(req)

      assert.deepStrictEqual(result, {})
    })

    it('# should return empty object for empty body', async () => {
      const req = createMockRequest([])
      const result = await getJsonBody(req)

      assert.deepStrictEqual(result, {})
    })

    it('# should parse JSON array but return it as-is', async () => {
      const req = createMockRequest([JSON.stringify([1, 2, 3])])
      const result = await getJsonBody(req)

      assert.deepStrictEqual(result, [1, 2, 3] as any)
    })

    it('# should return null if JSON is null', async () => {
      const req = createMockRequest(['null'])
      const result = await getJsonBody(req)
      assert.strictEqual(result, null)
    })
  })
})
