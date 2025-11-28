import type { IncomingMessage } from 'node:http'
import { parse } from 'node:querystring'

import { getRequestBody } from './main'

const getUrlEncodedBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  const body = await getRequestBody(req)

  return Object.entries(parse(body.toString())).reduce(
    (acc, [key, val]) => {
      acc[key.trim()] = typeof val === 'string' ? val.trim() : val
      return acc
    },
    {} as Record<string, unknown>
  )
}

export { getUrlEncodedBody }
