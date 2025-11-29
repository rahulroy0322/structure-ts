import { assert, describe, it } from 'vitest'
import {
  getCleanBaseUrl,
  getCleanPath,
  getCleanResponseUrl,
  getParams,
  getRegexpFromUrl,
} from '../../src/stratus-ts/router/utils'

describe('# Path Utils', () => {
  describe('# getCleanPath', () => {
    it('# should clean path with leading slash', () => {
      const path = getCleanPath('', '/users')
      assert.strictEqual(path, '/users')
    })

    it('# should clean path without leading slash', () => {
      const path = getCleanPath('', 'users')
      assert.strictEqual(path, '/users')
    })

    it('# should remove trailing slash', () => {
      const path = getCleanPath('', '/users/')
      assert.strictEqual(path, '/users')
    })

    it('# should combine base URL and path', () => {
      const path = getCleanPath('/api', '/users')
      assert.strictEqual(path, '/api/users')
    })

    it('# should handle base URL without slashes', () => {
      const path = getCleanPath('api', 'users')
      assert.strictEqual(path, '/api/users')
    })

    it('# should handle double slashes', () => {
      const path = getCleanPath('/api/', '/users')
      assert.strictEqual(path, '/api/users')
    })

    it('# should throw on invalid path with backslash', () => {
      assert.throws(() => {
        getCleanPath('', '/users\\admin')
      })
    })

    it('# should handle root path', () => {
      const path = getCleanPath('', '/')
      assert.strictEqual(path, '/')
    })

    it('# should handle nested paths', () => {
      const path = getCleanPath('/api/v1', '/users/profile')
      assert.strictEqual(path, '/api/v1/users/profile')
    })
  })

  describe('# getCleanBaseUrl', () => {
    it('# should remove leading slash', () => {
      const url = getCleanBaseUrl('/api')
      assert.strictEqual(url, 'api')
    })

    it('# should remove trailing slash', () => {
      const url = getCleanBaseUrl('api/')
      assert.strictEqual(url, 'api')
    })

    it('# should remove both slashes', () => {
      const url = getCleanBaseUrl('/api/')
      assert.strictEqual(url, 'api')
    })

    it('# should handle empty string', () => {
      const url = getCleanBaseUrl('')
      assert.strictEqual(url, '')
    })

    it('# should handle nested paths', () => {
      const url = getCleanBaseUrl('/api/v1/')
      assert.strictEqual(url, 'api/v1')
    })
  })

  describe('# getCleanResponseUrl', () => {
    it('# should ensure leading slash', () => {
      const url = getCleanResponseUrl('users')
      assert.strictEqual(url, '/users')
    })

    it('# should remove trailing slash', () => {
      const url = getCleanResponseUrl('/users/')
      assert.strictEqual(url, '/users')
    })

    it('# should handle root path', () => {
      const url = getCleanResponseUrl('/')
      assert.strictEqual(url, '/')
    })

    it('# should handle nested paths', () => {
      const url = getCleanResponseUrl('api/users/profile')
      assert.strictEqual(url, '/api/users/profile')
    })

    it('# should clean multiple trailing slashes', () => {
      const url = getCleanResponseUrl('/users//')
      assert.strictEqual(url, '/users/')
    })
  })

  describe('# getRegexpFromUrl', () => {
    it('# should create regex for int parameter', () => {
      const { regexp, keys } = getRegexpFromUrl('/users/<id:int>')

      assert.ok(regexp.test('/users/123'))
      assert.ok(!regexp.test('/users/abc'))
      assert.strictEqual(keys.length, 1)
      assert.strictEqual(keys[0]?.key, 'id')
    })

    it('# should create regex for string parameter', () => {
      const { regexp, keys } = getRegexpFromUrl('/users/<name:str>')

      assert.ok(regexp.test('/users/john'))
      assert.ok(!regexp.test('/users/123'))
      assert.strictEqual(keys.length, 1)
      assert.strictEqual(keys[0]?.key, 'name')
    })

    it('# should create regex for wildcard parameter', () => {
      const { regexp, keys } = getRegexpFromUrl('/files/<path:*>')

      assert.ok(regexp.test('/files/abc123'))
      assert.ok(regexp.test('/files/file123'))
      assert.strictEqual(keys.length, 1)
      assert.strictEqual(keys[0]?.key, 'path')
    })

    it('# should create regex for bool parameter', () => {
      const { regexp, keys } = getRegexpFromUrl('/status/<active:bool>')

      assert.ok(regexp.test('/status/true'))
      assert.ok(regexp.test('/status/false'))
      assert.ok(!regexp.test('/status/yes'))
      assert.strictEqual(keys.length, 1)
      assert.strictEqual(keys[0]?.key, 'active')
    })

    it('# should handle multiple parameters', () => {
      const { regexp, keys } = getRegexpFromUrl(
        '/users/<userId:int>/posts/<postId:int>'
      )

      assert.ok(regexp.test('/users/1/posts/2'))
      assert.ok(!regexp.test('/users/abc/posts/2'))
      assert.strictEqual(keys.length, 2)
      assert.strictEqual(keys[0]?.key, 'userId')
      assert.strictEqual(keys[1]?.key, 'postId')
    })

    // ! TODO
    //     it('# should handle mixed static and dynamic segments', () => {
    //       // const { regexp, keys } = getRegexpFromUrl('/api/v1/users/<id:int>/profile')

    // const DELIMITER = '<'
    // const CATCH_ALL = '*'
    //     const notPresent = -1

    //     const path = '/<id:int>/profile'

    //     if (
    //       path.indexOf(DELIMITER) === notPresent &&
    //       path.indexOf(CATCH_ALL) === notPresent
    //     ) {
    // console.log('abxa');

    //     }

    //     else{
    //       console.log(
    //         getRegexpFromUrl(path)
    //       );

    //     }

    //       assert.ok(1)
    //     //   assert.ok(regexp.test('/api/v1/users/123/profile'))
    //     //   assert.ok(!regexp.test('/api/v1/users/abc/profile'))
    //     //   assert.strictEqual(keys.length, 1)
    //     })

    it('# should validate translators', () => {
      const { keys } = getRegexpFromUrl('/users/<id:int>')

      assert.strictEqual(typeof keys[0]?.translator, 'function')
      assert.strictEqual(keys[0]?.translator('123'), 123)
    })
  })

  describe('# getParams', () => {
    it('# should extract int parameters', () => {
      const { regexp, keys } = getRegexpFromUrl('/users/<id:int>')
      const result = getParams({ regexp, keys }, '/users/123')

      assert.ok(result)
      assert.strictEqual(result.path, '/users/123')
      assert.strictEqual(result.params.id, 123)
    })

    it('# should extract string parameters', () => {
      const { regexp, keys } = getRegexpFromUrl('/users/<name:str>')
      const result = getParams({ regexp, keys }, '/users/john')

      assert.ok(result)
      assert.strictEqual(result.params.name, 'john')
    })

    it('# should extract boolean parameters', () => {
      const { regexp, keys } = getRegexpFromUrl('/status/<active:bool>')
      const result = getParams({ regexp, keys }, '/status/true')

      assert.ok(result)
      assert.strictEqual(result.params.active, true)
    })

    it('# should extract multiple parameters', () => {
      const { regexp, keys } = getRegexpFromUrl(
        '/users/<userId:int>/posts/<postId:int>'
      )
      const result = getParams({ regexp, keys }, '/users/1/posts/2')

      assert.ok(result)
      assert.strictEqual(result.params.userId, 1)
      assert.strictEqual(result.params.postId, 2)
    })

    it('# should return false for non-matching URL', () => {
      const { regexp, keys } = getRegexpFromUrl('/users/<id:int>')
      const result = getParams({ regexp, keys }, '/posts/123')

      assert.strictEqual(result, false)
    })

    it('# should return false for invalid parameter type', () => {
      const { regexp, keys } = getRegexpFromUrl('/users/<id:int>')
      const result = getParams({ regexp, keys }, '/users/abc')

      assert.strictEqual(result, false)
    })

    it('# should handle wildcard parameters', () => {
      const { regexp, keys } = getRegexpFromUrl('/files/<path:*>')
      const result = getParams({ regexp, keys }, '/files/doc123')

      assert.ok(result)
      assert.strictEqual(result.params.path, 'doc123')
    })
  })

  // ? TODO
  // describe('# Edge Cases', () => {
  // insted of createing with while use regexp
  // it('# should handle root path', () => {
  //   const { regexp } = getRegexpFromUrl('/')
  //   assert.ok(regexp.test('/'))
  // })

  // it('# should handle paths with multiple slashes', () => {
  //   const { regexp } = getRegexpFromUrl('/api/v1/users')
  //   assert.ok(regexp.test('/api/v1/users'))
  //   assert.ok(!regexp.test('/api/v2/users'))
  // })

  // it('# should be case sensitive', () => {
  //   const { regexp } = getRegexpFromUrl('/Users')
  //   assert.ok(regexp.test('/Users'))
  //   assert.ok(!regexp.test('/users'))
  // })
  // })
})
