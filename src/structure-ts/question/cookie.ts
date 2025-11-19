const decode = (str: string) => {
  const start = 0
  const last = 1

  if (str.endsWith(';')) {
    return decodeURIComponent(str.substring(start, str.length - last))
  }
  return decodeURIComponent(str)
}

const parseCookie = (cookie: string) => {
  const untill = -1

  const _cookies = cookie.split(' ')
  const cookies = {} as Record<string, string>

  for (const c of _cookies) {
    if (c.indexOf('=') === untill) {
      // !'some thing went wrong!'
      console.error('some thing went wrong!')
      // debug('some thing went wrong!')

      break
    }

    const [key, val] = c.split('=')

    if (key && val !== undefined) {
      cookies[key] = decode(val)
    }

    if (!c.endsWith(';')) {
      break
    }
  }

  return cookies
}
export { parseCookie }
