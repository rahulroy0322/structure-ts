import { assert, describe, it } from 'vitest'
import { stringify } from '../../src/stratus-ts/utils/stringify'

describe('# usitls', () => {
  it('# should converts object to JSON string', () => {
    const result = stringify({ a: 1 })
    assert.equal(result, '{"a":1}')
  })

  it('# should handles arrays', () => {
    const result = stringify([1, 2, 3])
    assert.equal(result, '[1,2,3]')
  })

  it('# should handles null', () => {
    const result = stringify(null)
    assert.equal(result, 'null')
  })
})
