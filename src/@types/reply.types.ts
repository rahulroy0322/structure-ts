type CookieOptions = Partial<{
  // encode: (str:string)=>string
  sameSite: boolean | 'lax' | 'strict' | 'none'
  priority: 'low' | 'medium' | 'high'
  domain: string
  path: string
  httpOnly: boolean
  secure: boolean
  maxAge: number
  expires: Date
  partitioned: boolean
}>

interface ErrorRespnsceType {
  success: false
  route?: string
  error: {
    name: string
    message: string
    stack?: string
  }
}

interface SuccessRespnsceType {
  success: true
  data: Record<string, unknown> | unknown[]
}

type ServerRespnsceType = SuccessRespnsceType | ErrorRespnsceType

type ReplyType<T> = {
  get: (field: string) => string | number | string[] | undefined
  set: (field: string, val: unknown) => ReplyType<T>
  code: () => number
  status: (code: number) => ReplyType<T>
  header: (field: string, val: unknown) => ReplyType<T>
  type: (type: string) => ReplyType<T>
  contentType: (type: string) => ReplyType<T>
  cookie: (name: string, value: string, option?: CookieOptions) => ReplyType<T>

  render: (template: string, data?: Record<string, unknown>) => void

  send: (body: unknown) => void
  json: (data: T) => void
}

export type { ReplyType, ServerRespnsceType, CookieOptions, ErrorRespnsceType }
