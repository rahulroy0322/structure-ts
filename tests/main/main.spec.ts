import { assert, describe, it } from 'vitest'
import { connectToDb, Stratus } from '../../src/main'

describe('# StratusTS', () => {
  it('# should exports core modules', () => {
    assert.ok(connectToDb)
    assert.ok(Stratus)
  })
})
