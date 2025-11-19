import type { IncomingMessage } from 'node:http'

import { getQuery } from '../query'
import { getJsonBody } from './json'
import { getMaltiPartBody } from './maltipart'
import { getUrlEncodedBody } from './urlEncode'

const getRequestBody = async (req: IncomingMessage): Promise<Buffer> => {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

const getTransformedBody = async (
  req: IncomingMessage
): Promise<{
  body: Record<string, unknown>
  files: Record<string, unknown>
}> => {
  const _method = (req.method || 'get').toLowerCase()

  const contentType = req.headers['content-type']?.toLowerCase()

  if (!contentType) {
    const body = getQuery(req)
    return {
      body,
      files: {},
    }
  }

  if (contentType.startsWith('multipart/form-data'.toLowerCase())) {
    if (_method !== 'post') {
      throw new Error('only "post" methode can handel maptipart data!')
    }

    const { fields: body, files } = await getMaltiPartBody(req)

    return {
      files,
      body,
    }
  }

  if (contentType.includes('json'.toLowerCase())) {
    const body = await getJsonBody(req)

    return {
      body,
      files: {},
    }
  }

  if (contentType.includes('form-urlencoded'.toLowerCase())) {
    const body = await getUrlEncodedBody(req)

    return {
      body,
      files: {},
    }
  }

  //! `invalide content type "${contentType}"`)
  console.error(`invalide content type "${contentType}"`)
  // debug(`invalide content type "${contentType}"`)

  return {
    files: {},
    body: {},
  }
}

export { getRequestBody, getTransformedBody }
