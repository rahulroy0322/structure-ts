import type { IncomingMessage } from 'node:http'

import { getRequestBody } from './main'

const getBoundary = (contentType?: string): string => {
  const boundaryMatch = 1

  const match = contentType?.match(/boundary=(.+)$/)
  if (match) {
    return `--${match[boundaryMatch]}`
  }
  throw new Error('No boundary found in Content-Type header')
}

const splitBody = (body: Buffer, boundary: string): Buffer[] => {
  const untill = -1

  const boundaryBuffer = Buffer.from(boundary)
  const parts: Buffer[] = []
  let start = body.indexOf(boundaryBuffer) + boundaryBuffer.length
  let end = body.indexOf(boundaryBuffer, start)

  while (end !== untill) {
    parts.push(body.slice(start, end))

    start = end + boundaryBuffer.length
    end = body.indexOf(boundaryBuffer, start)
  }

  return parts
}

const parsePart = (
  part: Buffer
): { headers: Record<string, string>; body: Buffer } => {
  const start = 0

  const separator = '\r\n\r\n'
  const separatorIndex = part.indexOf(separator)
  const headerText = part.slice(start, separatorIndex).toString('utf-8')
  const body = part.slice(separatorIndex + separator.length)

  const headers: Record<string, string> = {}
  headerText.split('\r\n').forEach((line) => {
    const [key, value] = line.split(': ')
    // biome-ignore lint/style/noNonNullAssertion: it will be
    headers[key?.toLowerCase()!] = value!
  })

  return { headers, body }
}

const parseContentDisposition = (
  disposition: string
): { name: string; filename?: string } => {
  const match = 1

  const nameMatch = disposition.match(/name="([^"]+)"/)
  const filenameMatch = disposition.match(/filename="([^"]+)"/)
  if (nameMatch) {
    return {
      // biome-ignore lint/style/noNonNullAssertion: it will be
      name: nameMatch[match]!,
      filename: filenameMatch ? filenameMatch[match] : undefined,
    }
  }
  throw new Error('Invalid Content-Disposition header')
}

const getMaltiPartBody = async (req: IncomingMessage) => {
  const contentType = req.headers['content-type']

  const boundary = getBoundary(contentType)

  const body = await getRequestBody(req)
  const parts = splitBody(body, boundary)

  const fields: Record<string, string> = {}
  const files: Record<string, { filename: string; data: Buffer }> = {}

  parts.forEach((part) => {
    const { headers, body } = parsePart(part)
    const disposition = headers['content-disposition']
    if (disposition) {
      const { name, filename } = parseContentDisposition(disposition)
      if (filename) {
        files[name] = { filename, data: body }
      } else {
        fields[name] = body.toString('utf-8').trim()
      }
    }
  })

  return {
    fields,
    files,
  }
}

export { getMaltiPartBody }
