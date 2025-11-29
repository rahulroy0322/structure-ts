import { join } from 'node:path'
import type { KeyValType } from '../../@types'

const ERROR_EXIT_CODE = 1

const getRegexpFromUrl = (url: string) => {
  const current = 0

  const CHAR_REGEXP = /[a-zA-Z0-9]/
  const KEY_REGEXP = /[a-zA-Z]/

  const chars = [...url]

  let index = 0

  const at = () => chars[current]
  const eat = () => {
    const char = chars.shift()
    index++
    return char
  }

  const getStr = (regex: RegExp, prevChar: string): string => {
    const str = [prevChar]
    while (true) {
      // biome-ignore lint/style/noNonNullAssertion: it will exists
      if (!regex.test(at()!)) {
        break
      }
      const char = eat()
      if (char) {
        str.push(char)
      }
    }

    return str.join('')
  }

  const getType = (): Pick<KeyValType, 'translator'> & {
    regex: string
  } => {
    // biome-ignore lint/style/noNonNullAssertion: this is first
    const type = at() === '*' ? eat()! : getStr(KEY_REGEXP, eat()!)

    switch (type) {
      case 'int':
        return {
          regex: '([0-9]+)',
          translator: (value) => Number(value),
        }

      case 'bool':
        return {
          regex: '(true|false)',
          translator: (value) => Boolean(value),
        }
      case 'str':
        return {
          regex: '([a-zA-z][a-zA-Z0-9]+)',
          translator: (value) => String(value),
        }
      case '*':
        return {
          regex: '([a-zA-Z0-9]+)',
          translator: (value) => String(value),
        }
      default:
        console.error(`invalid type "${type}" for url "${url}"`)
        process.exit(ERROR_EXIT_CODE)
    }
  }

  const patterns = ['^']
  const keys = [] as KeyValType[]

  while (chars.length) {
    // biome-ignore lint/style/noNonNullAssertion: it will be
    const char = eat()!

    if (CHAR_REGEXP.test(char)) {
      patterns.push(getStr(CHAR_REGEXP, char))
      continue
    }

    if (char === '/') {
      patterns.push('\\/')
      continue
    }

    if (char === '<') {
      // TODO:
      // biome-ignore lint/style/noNonNullAssertion: it will be
      const key = getStr(KEY_REGEXP, eat()!)

      if (at() !== ':') {
        console.error('invalid url', url)
        process.exit(ERROR_EXIT_CODE)
      }
      eat()

      const { regex, translator } = getType()

      if (eat() !== '>') {
        console.error('invalid url', url)
        process.exit(ERROR_EXIT_CODE)
      }

      patterns.push(regex)

      keys.push({
        kind: 'param',
        translator,
        key,
      })

      continue
    }

    console.error(`invalid charector "${char}" at "${index}" for url"${url}"`)
    process.exit(ERROR_EXIT_CODE)
  }
  patterns.push('$')
  const regexp = new RegExp(patterns.join(''))

  return {
    regexp,
    keys,
  }
}

const getCleanResponseUrl = (url: string) => {
  const start = 0
  const last = 1

  if (url.startsWith('/')) {
    url = url.substring(last)
  }
  if (url.endsWith('/')) {
    url = url.substring(start, url.length - last)
  }
  return `/${url}`
}

const getCleanBaseUrl = (baseUrl: string) => {
  const start = 0
  const last = 1

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(start, baseUrl.length - last)
  }
  if (baseUrl.startsWith('/')) {
    baseUrl = baseUrl.substring(last)
  }
  return baseUrl
}

const getCleanPath = (baseUrl: string, path: string) => {
  const start = 0
  const last = 1
  const notPresent = -1

  path = join(baseUrl, path)

  if (path.indexOf('//') !== notPresent || path.indexOf('\\') !== notPresent) {
    throw new Error(`Invalid Path at "${path}"`)
  }

  if (path.endsWith('/')) {
    path = path.substring(start, path.length - last)
  }

  if (path.startsWith('/')) {
    return path
  }
  return `/${path}`
}

const getParams = (
  { regexp, keys }: ReturnType<typeof getRegexpFromUrl>,
  url: string
) => {
  const match = regexp.exec(url)
  if (!match) {
    return false
  }

  const [path, ...others] = match

  const params = others.reduce(
    (acc, param, index) => {
      // biome-ignore lint/style/noNonNullAssertion: chacked up
      const { key, translator } = keys[index]!
      acc[key] = translator(param)

      return acc
    },
    {} as Record<string, ReturnType<KeyValType['translator']>>
  )

  return { path, params }
}

export {
  getParams,
  getRegexpFromUrl,
  getCleanResponseUrl,
  getCleanBaseUrl,
  getCleanPath,
}
