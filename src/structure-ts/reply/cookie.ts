import type { IncomingMessage, ServerResponse } from 'node:http'

import type { CookieOptions } from '../../@types'

const getPriority = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'Low'
    case 'medium':
      return 'Medium'
    case 'high':
      return 'High'
    default:
      return null
  }
}
const getSite = (site: string | boolean): string | null => {
  switch (site) {
    case true:
      return 'Strict'
    case 'lax':
      return 'Lax'
    case 'strict':
      return 'Strict'
    case 'none':
      return 'None'
    default:
      return null
  }
}

const serialize = (
  name: string,
  value: string,
  option?: CookieOptions
): string => {
  const strArray = [`${name}=${encodeURIComponent(value)}`]

  if (!option) {
    return strArray.join('')
  }

  const {
    path,
    domain,
    maxAge,
    expires,
    httpOnly,
    priority,
    sameSite,
    secure,
    partitioned,
  } = option

  if (null != maxAge) {
    const age = Math.floor(maxAge)

    if (!isFinite(age)) {
      //! option maxAge is invalid!
      console.error('option maxAge is invalid!')
      // debug('option maxAge is invalid!')
    } else {
      strArray.push(`Max-Age=${age}`)
    }
  }

  if (domain) {
    // * have to work in
    console.error('todo in domain section!')
    // debug("todo in domain section!")
    // if (!domainValueRegExp.test(option.domain)) {
    //   throw new TypeError('option domain is invalid');
    // }

    // strArray.push(
    //     `Domain=${domain}`
    // )
  }

  if (path) {
    //TODO
    // if (!pathValueRegExp.test(option.path)) {
    //     throw new TypeError('option path is invalid');
    // }

    strArray.push(`Path=${path}`)
  }

  if (expires) {
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      // debug('option expires is invalid');
    }

    strArray.push(`Expires=${expires.toUTCString()}`)
  }

  if (httpOnly) {
    strArray.push('HttpOnly')
  }

  if (secure) {
    strArray.push('Secure')
  }

  if (partitioned) {
    strArray.push('Partitioned')
  }

  if (priority) {
    const pri = typeof priority === 'string' ? priority.toLowerCase() : priority

    const _priority = getPriority(pri)

    if (_priority === null) {
      //! option priority is invalid!
      console.error('option priority is invalid!')
      // debug('option priority is invalid!')
    } else {
      strArray.push(`Priority=${_priority}`)
    }
  }

  if (sameSite) {
    const site =
      typeof sameSite === 'string' ? sameSite.toLowerCase() : sameSite

    const _sameSite = getSite(site)

    if (_sameSite === null) {
      // ! option sameSite is invalid!
      console.error('option sameSite is invalid!')
      // debug('option sameSite is invalid!')
    } else {
      strArray.push(`SameSite=${_sameSite}`)
    }
  }

  return strArray.join('; ')
}

const isDate = (val: unknown): val is Date => val instanceof Date

const cookieKey = 'Set-Cookie'

const notPresent = -1

const setCookie =
  (res: ServerResponse<IncomingMessage>) =>
  (name: string, value: string, option?: CookieOptions) => {
    if (name.indexOf(' ') !== notPresent) {
      res.removeHeader('Set-Cookie')
      throw new TypeError(`name is invalid: ${name}`)
    }

    const prev = res.getHeader(cookieKey.toLowerCase()) as string | string[]

    let val: string | string[] = value

    if (prev) {
      const newVal = serialize(name, value, option)
      val = Array.isArray(prev) ? prev.concat(newVal) : [prev].concat(newVal)
    }

    if (Array.isArray(val)) {
      res.setHeader('Set-Cookie', val.map(String))
      return
    }

    res.setHeader('Set-Cookie', serialize(name, value, option))
  }

export { setCookie }
