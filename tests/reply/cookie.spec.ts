// import assert from 'node:assert';
// import type { IncomingMessage, ServerResponse } from 'node:http';
// import { describe, it } from 'node:test';

import type { IncomingMessage, ServerResponse } from 'node:http'
import { assert, describe, expect, it, vi } from 'vitest'

import { setCookie } from '../../src/stratus-ts/reply/cookie'

const createMockResponse = () => {
  const headers: Record<string, string> = {}

  return {
    setHeader: (name: string, value: string) => {
      name = name.toLowerCase()
      headers[name] = value
    },
    getHeader: (name: string) => headers[name],
    _headers: headers,
  } as unknown as ServerResponse<IncomingMessage>
}

const cookieKey = 'set-cookie'

describe('# Set Cookie', () => {
  describe('# basic Cookie', () => {
    it('# should set a basic cookie', () => {
      const res = createMockResponse()
      setCookie(res)('test', '123')

      assert.strictEqual(res.getHeader(cookieKey), 'test=123')
    })

    it('# should set cookie with Max-Age and Path', () => {
      const res = createMockResponse()
      setCookie(res)('token', 'abc', {
        maxAge: 3600,
        path: '/',
      })

      assert.strictEqual(
        res.getHeader(cookieKey),
        'token=abc; Max-Age=3600; Path=/'
      )
    })
  })

  describe('# secure Cookie', () => {
    it('# should set cookie with HttpOnly and Secure flags', () => {
      const res = createMockResponse()
      setCookie(res)('session', 'xyz', {
        httpOnly: true,
        secure: true,
      })

      assert.strictEqual(
        res.getHeader(cookieKey),
        'session=xyz; HttpOnly; Secure'
      )
    })
  })

  describe('# Cookie extra', () => {
    it('# should set cookie with Expires', () => {
      const res = createMockResponse()
      const date = new Date('2030-01-01T00:00:00Z')

      setCookie(res)('auth', 'token', {
        expires: date,
      })

      assert.strictEqual(
        res.getHeader(cookieKey),
        `auth=token; Expires=${date.toUTCString()}`
      )
    })

    it('# should set cookie with SameSite and Priority', () => {
      const res = createMockResponse()
      setCookie(res)('prefs', 'light', {
        sameSite: 'lax',
        priority: 'high',
      })

      assert.strictEqual(
        res.getHeader(cookieKey),
        'prefs=light; Priority=High; SameSite=Lax'
      )
    })

    it('# should set cookie with Partitioned', () => {
      const res = createMockResponse()
      setCookie(res)('tracker', 'val', {
        partitioned: true,
      })

      assert.strictEqual(res.getHeader(cookieKey), 'tracker=val; Partitioned')
    })
  })

  describe('# ignore/invalid Cookie', () => {
    it('# should ignore invalid maxAge and print error', () => {
      const res = createMockResponse()

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      setCookie(res)('broken', 'value', {
        maxAge: Infinity,
      })

      expect(errorSpy).toHaveBeenCalledWith('option maxAge is invalid!')

      errorSpy.mockRestore()
    })

    it('# should ignore invalid priority and print error', () => {
      const res = createMockResponse()

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      setCookie(res)('bad', 'cookie', {
        priority: 'urgent' as unknown as 'low',
      })

      expect(errorSpy).toHaveBeenCalledWith('option priority is invalid!')

      errorSpy.mockRestore()
    })

    it('# should ignore invalid sameSite and print error', () => {
      const res = createMockResponse()

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      setCookie(res)('badsite', 'val', {
        sameSite: 'middle' as unknown as boolean,
      })

      expect(errorSpy).toHaveBeenCalledWith('option sameSite is invalid!')

      errorSpy.mockRestore()
    })
  })
})
