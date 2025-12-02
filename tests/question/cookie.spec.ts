import { assert, describe, expect, it, vi } from 'vitest'
import { parseCookie } from '../../src/stratus-ts/question/cookie'

describe('# cookie', () => {
  describe('# basic cookie persing', () => {
    it('# should get nothing from empty string', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const cookies = parseCookie('')

      assert.deepEqual(cookies, {})
      expect(errorSpy).toHaveBeenCalledOnce()
      expect(errorSpy).toHaveBeenCalledWith('some thing went wrong!')

      errorSpy.mockRestore()
    })

    it('# should get a basic cookie', () => {
      const cookies = parseCookie('name=val')

      assert.deepEqual(cookies, {
        name: 'val',
      })
    })
  })

  describe('# advence cookie persing', () => {
    it('# should get multiple cookie', () => {
      const cookies = parseCookie(
        'name=val; other=other%20value; another=another%20value'
      )

      assert.deepEqual(cookies, {
        name: 'val',
        other: 'other value',
        another: 'another value',
      })
    })
  })
})
