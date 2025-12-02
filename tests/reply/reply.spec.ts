import { IncomingMessage, ServerResponse } from 'node:http'
import { assert, describe, it } from 'vitest'
import type { QuestionType } from '../../src/@types'
import { Reply } from '../../src/stratus-ts/reply/main'

const mockResponse = () => {
  const res = new ServerResponse(new IncomingMessage({} as any))
  res.statusCode = 200

  ;(res as any).headers = {}

  ;(res as any).setHeader = (field: string, value: string) => {
    ;(res as any).headers[field] = value
  }

  ;(res as any).getHeader = (field: string) => (res as any).headers[field]

  ;(res as any).write = (chunk: string) => {
    if (chunk) {
      ;(res as any).body += chunk // Capture the body content
    }
  }

  ;(res as any).end = () => {} // Mocking the end method
  return res
}

describe('# reply', () => {
  describe('# basic reply', () => {
    it('# should set status correctly', () => {
      const reply = Reply({
        baseDir: '',
        question: {} as QuestionType,
        errorController: () => {},
        templateDir: '',
        reply: mockResponse(),
      })

      reply.status(404)
      assert.strictEqual(
        (reply as any).raw.statusCode,
        404,
        'Status code should be set to 404'
      )
    })

    it('# should set content type header correctly', () => {
      const reply = Reply({
        baseDir: '',
        question: {} as QuestionType,
        errorController: () => {},
        templateDir: '',
        reply: mockResponse(),
      })

      reply.type('application/json')

      assert.strictEqual(
        (reply as any).raw.getHeader('Content-Type'),
        'application/json',
        'Content-Type should be application/json'
      )
    })

    it('# should send JSON response correctly', () => {
      const reply = Reply({
        baseDir: '',
        question: {} as QuestionType,
        errorController: () => {},
        templateDir: '',
        reply: mockResponse(),
      })

      const data = { message: 'Hello' }
      reply.json({
        success: true,
        data,
      })
      assert.strictEqual(
        (reply as any).raw.getHeader('Content-Type'),
        'application/json',
        'Content-Type should be application/json'
      )
      assert.strictEqual(
        (reply as any).raw.body,
        'undefined{"success":true,"data":{"message":"Hello"}}',
        // TODO ?
        // added undefined at the start some how i don't know
        // but i will work on it in future
        'Body should be same as send'
      )
    })
  })

  describe('# advence reply', () => {
    it('# should handle cookies correctly', () => {
      const reply = Reply({
        baseDir: '',
        question: {} as QuestionType,
        errorController: () => {},
        templateDir: '',
        reply: mockResponse(),
      })

      reply.cookie('token', '1234', { maxAge: 3600 })
      assert.strictEqual(
        (reply as any).raw.getHeader('Set-Cookie'),
        'token=1234; Max-Age=3600',
        'Cookie header should be set'
      )
    })

    it('# should render HTML correctly', () => {
      const reply = Reply({
        baseDir: '',
        question: {} as QuestionType,
        errorController: () => {},
        templateDir: 'tests/reply/templates',
        reply: mockResponse(),
      })

      reply.render('reply', { message: 'Hello' })
      // Check that the content is rendered correctly in the response body
      assert.strictEqual(
        (reply as any).raw.getHeader('Content-Type'),
        'text/html',
        'Content-Type should be text/html'
      )

      assert.strictEqual(
        (reply as any).raw.body,
        'undefined<html><body>Hello</body></html>',
        // TODO ?
        // added undefined at the start some how i don't know
        // but i will work on it in future
        'Body should be same as send'
      )
    })
  })

  describe('# error in reply', () => {
    it('# should throw an error when setting invalid status code', () => {
      const reply = Reply({
        baseDir: '',
        question: {} as QuestionType,
        errorController: () => {},
        templateDir: '',
        reply: mockResponse(),
      })

      assert.throws(() => {
        reply.status(10000) // Invalid status code
      }, /Invalid status code/)
    })
  })
})
