import type { IncomingMessage } from 'node:http'

import { getRequestBody } from './main'

const getJsonBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  const body = (await getRequestBody(req)).toString()
  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

export { getJsonBody }
