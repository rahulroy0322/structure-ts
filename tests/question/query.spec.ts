import type { IncomingMessage } from 'node:http'
import { assert, describe, it } from 'vitest'
import { getQuery } from '../../src/stratus-ts/question/query'

const createMockRequest = (url: string = '') => {
  return {
    url,
  } as unknown as IncomingMessage
}

describe('# getQuery', () => {
  describe('# basic query', () => {
    it('# should return empty object when url is empty', () => {
      const req = createMockRequest()
      const query = getQuery(req)

      assert.deepEqual(query, {})
    })

    it('# should return empty object when there was nothing in query url', () => {
      const req = createMockRequest('/?')
      const query = getQuery(req)

      assert.deepEqual(query, {})
    })

    it('# should return perse besic values', () => {
      const req = createMockRequest('/?name=john&age=120&adult=true&&gender=m')
      const query = getQuery(req)

      assert.deepEqual(query, {
        name: 'john',
        age: 120,
        adult: true,
        gender: 'm',
      })
    })
  })

  describe('# advence query', () => {
    it('# should return true when value is not present', () => {
      const req = createMockRequest('/?terminal')
      const query = getQuery(req)

      assert.deepEqual(query, {
        terminal: true,
      })
    })
  })
})
