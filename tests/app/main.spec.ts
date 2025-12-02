import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkApps } from '../../src/stratus-ts/app/main'
import { loadSettings, SETTINGS } from '../../src/stratus-ts/settings/main'

describe('# checkApps', () => {
  describe('# vaild apps', () => {
    beforeEach(async () => {
      try {
        await loadSettings()
      } catch (e) {
        console.error({ e })
      }
    })
    it('# should aggregate routes correctly when files are valid', async () => {
      const apps = ['app/base', 'app/other']

      SETTINGS!.APPS = apps

      const { dynamic, main } = await checkApps()

      //exists
      expect(main).toBeTruthy()
      expect(dynamic).toBeTruthy()

      // type
      expect(typeof main).toBe('object')
      expect(Array.isArray(dynamic)).toBe(true)

      expect('/base' in main).toBe(true)
      expect(typeof main['/base'].get?.controller).toBe('function')

      expect('/other' in main).toBe(true)
      expect(typeof main['/other'].get?.controller).toBe('function')

      expect(dynamic).toEqual([])
    })
  })

  describe('# invaild apps', () => {
    beforeEach(async () => {
      try {
        await loadSettings()
      } catch (e) {
        console.error({ e })
      }
    })

    it('# should exit for invalid route schema', async () => {
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const apps = ['app/invalid']

      SETTINGS!.APPS = apps

      await checkApps()

      // ✅ process.exit assertions
      expect(exitSpy).toHaveBeenCalledTimes(1)
      expect(exitSpy).toHaveBeenCalledWith(1)

      // ✅ console.error assertions
      expect(errorSpy).toHaveBeenCalledTimes(1)
      expect(errorSpy.mock.calls[0]?.[0]).toBeInstanceOf(Error)
      expect(errorSpy.mock.calls[0]?.[0].message).toMatch(
        `"controllers" file does not exists at "app/invalid" app!`
      )

      // ✅ Restore originals
      exitSpy.mockRestore()
      errorSpy.mockRestore()
    })

    it('# should fail if the route file does not exist', async () => {
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const apps = ['app/non']

      SETTINGS!.APPS = apps

      await checkApps()

      // ✅ process.exit assertions
      expect(exitSpy).toHaveBeenCalledTimes(1)
      expect(exitSpy).toHaveBeenCalledWith(1)

      // ✅ console.error assertions
      expect(errorSpy).toHaveBeenCalledTimes(1)
      expect(errorSpy.mock.calls[0]?.[0]).toBeInstanceOf(Error)
      expect(errorSpy.mock.calls[0]?.[0].message).toMatch(
        `app "app/non" does not exists!`
      )
    })
  })
})
