import type { IncomingHttpHeaders, IncomingMessage } from 'node:http'

import type { MethodsType } from '.'
import type { ParamsUtilType } from './model/utils.types'

type QuestionType<ParamsType extends Record<string, unknown> = ParamsUtilType> =
  {
    hostname: () => string
    host: () => string

    path: () => string
    url: () => string

    ip: () => string | undefined
    method: () => MethodsType
    headers: () => IncomingHttpHeaders

    header: (name: string) => string | string[] | null
    get: (name: string) => string | string[] | null

    cookies: () => Record<string, string> | null
    query: () => Record<string, string | number | boolean>

    type: () => string
    contentType: () => string

    body: <
      B extends Record<string, unknown> = Record<string, unknown>,
      F extends Record<string, unknown> = Record<string, unknown>,
    >() => Promise<{
      body: B
      files: F
    }>
    params: () => ParamsType

    raw: () => IncomingMessage
  }

export type { QuestionType }
