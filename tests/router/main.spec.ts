import { assert, describe, it, vi } from 'vitest'
import { Router } from '../../src/main'

describe('# Router', () => {
  describe('# Basic Routes', () => {
    it('# should register a GET route', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('/', controller)

      assert.ok(routes.main['/'])
      assert.ok(routes.main['/']?.get)
      assert.strictEqual(routes.main['/']?.get?.controller, controller)
    })

    it('# should register a POST route', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.post('/users', controller)

      assert.ok(routes.main['/users'])
      assert.ok(routes.main['/users']?.post)
      assert.strictEqual(routes.main['/users']?.post?.controller, controller)
    })

    it('# should register multiple methods on same path', () => {
      const { routes, route } = Router()
      const getController = vi.fn()
      const postController = vi.fn()

      route.get('/api', getController)
      route.post('/api', postController)

      assert.strictEqual(routes.main['/api']?.get?.controller, getController)
      assert.strictEqual(routes.main['/api']?.post?.controller, postController)
    })

    it('# should clean paths properly', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('//users//', controller)

      assert.ok(routes.main['/users'])
    })
  })

  describe('# Basic Routes But For own func', () => {
    it('# should register a GET route', () => {
      const { routes, get } = Router()
      const controller = vi.fn()

      get('/', controller)

      assert.ok(routes.main['/'])
      assert.ok(routes.main['/']?.get)
      assert.strictEqual(routes.main['/']?.get?.controller, controller)
    })

    it('# should register a POST route', () => {
      const { routes, post } = Router()
      const controller = vi.fn()

      post('/users', controller)

      assert.ok(routes.main['/users'])
      assert.ok(routes.main['/users']?.post)
      assert.strictEqual(routes.main['/users']?.post?.controller, controller)
    })

    it('# should register multiple methods on same path', () => {
      const { routes, get, post } = Router()
      const getController = vi.fn()
      const postController = vi.fn()

      get('/api', getController)
      post('/api', postController)

      assert.strictEqual(routes.main['/api']?.get?.controller, getController)
      assert.strictEqual(routes.main['/api']?.post?.controller, postController)
    })

    // ! TODO
    it('# should clean paths properly', () => {
      const { routes, get } = Router()
      const controller = vi.fn()

      get('//users//', controller)

      assert.ok(routes.main['/users'])
    })
  })

  describe('# Dynamic Routes', () => {
    it('# should register dynamic route with parameters', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('/users/<id:int>', controller)

      assert.strictEqual(routes.dynamic.length, 1)
      const [regexp, keys, method, ctrl] = routes.dynamic[0]!

      assert.ok(regexp instanceof RegExp)
      assert.strictEqual(keys.length, 1)
      assert.strictEqual(keys[0]?.key, 'id')
      assert.strictEqual(method, 'get')
      assert.strictEqual(ctrl, controller)
    })

    it('# should handle string parameters', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('/users/<name:str>', controller)

      const [, keys] = routes.dynamic[0]!
      assert.strictEqual(keys[0]?.key, 'name')
    })

    it('# should handle wildcard parameters', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('/files/<path:*>', controller)

      const [regexp] = routes.dynamic[0]!
      assert.ok(regexp.test('/files/abc123'))
    })

    it('# should handle multiple parameters', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('/users/<userId:int>/posts/<postId:int>', controller)

      const [, keys] = routes.dynamic[0]!
      assert.strictEqual(keys.length, 2)
      assert.strictEqual(keys[0]?.key, 'userId')
      assert.strictEqual(keys[1]?.key, 'postId')
    })
  })

  describe('Base URL', () => {
    it('# should prepend base URL to routes', () => {
      const { routes, route } = Router('/api/v1')
      const controller = vi.fn()

      route.get('/users', controller)

      assert.ok(routes.main['/api/v1/users'])
    })

    it('# should handle base URL with trailing slash', () => {
      const { routes, route } = Router('/api/')
      const controller = vi.fn()

      route.get('/users', controller)

      assert.ok(routes.main['/api/users'])
    })
  })

  describe('Body Validation Schema', () => {
    it('# should register route with body validation', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.post('/users', controller, {
        body: {
          name: { type: 'string', required: true },
          email: { type: 'email', required: true },
          age: { type: 'number' },
        },
      })

      const usersRoute = routes.main['/users']?.post

      assert.ok(usersRoute?.body)
    })

    it('# should create proper validation schema for required fields', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.post('/users', controller, {
        body: {
          name: { type: 'string', required: true },
        },
      })

      const usersRoute = routes.main['/users']?.post
      assert.ok(usersRoute?.body)

      // Test validation
      const result = usersRoute?.body?.validate({ name: 'John' })
      assert.strictEqual(result?.error, undefined)
    })

    it('# should fail validation for missing required fields', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.post('/users', controller, {
        body: {
          name: { type: 'string', required: true },
        },
      })

      const usersRoute = routes.main['/users']?.post
      const result = usersRoute?.body?.validate({})
      assert.ok(result?.error)
    })
  })

  describe('All HTTP Methods', () => {
    it('# should support all HTTP methods', () => {
      const { routes, route } = Router()
      const controller = vi.fn()

      route.get('/resource', controller)
      route.post('/resource', controller)
      route.put('/resource', controller)
      route.patch('/resource', controller)
      route.delete('/resource', controller)
      route.options('/resource', controller)
      route.head('/resource', controller)
      route.connect('/resource', controller)

      // ! TODO support -> all

      const resource = routes.main['/resource']
      assert.ok(resource?.get)
      assert.ok(resource?.post)
      assert.ok(resource?.put)
      assert.ok(resource?.patch)
      assert.ok(resource?.delete)
      assert.ok(resource?.options)
      assert.ok(resource?.head)
      assert.ok(resource?.connect)
    })
  })
})
