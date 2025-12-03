import type { ObjectSchema } from 'joi'

import type {
  ErrorRespnsceType,
  QuestionType,
  ReplyType,
  ServerRespnsceType,
} from '.'

type ValidTypesType = 'email' | 'string' | 'number'

type MethodsType =
  | 'get'
  | 'post'
  | 'patch'
  | 'put'
  | 'delete'
  | 'options'
  | 'head'
  | 'connect'

type ControllerType<
  ParamsType extends Record<string, unknown> = Record<
    string,
    string | number | boolean
  >,
> = (
  question: QuestionType<ParamsType>,
  reply: ReplyType<ServerRespnsceType>
) => void | Promise<void>

type ErrorControllerType = (
  error: unknown,
  question: QuestionType,
  reply: ReplyType<ErrorRespnsceType>
) => void

type RoutesType = Record<
  string,
  Partial<
    Record<
      MethodsType,
      {
        controller: ControllerType
        body: ObjectSchema | null
      }
    >
  >
>

type KeyValType = {
  kind: 'param'
  key: string
  translator: (value: string) => number | boolean | string
}

type DynamicRoutesType = [
  RegExp,
  KeyValType[],
  MethodsType,
  ControllerType,
  {
    body: ObjectSchema | null
  },
]

type ControllerOptionType = {
  body: Record<
    string,
    {
      type: ValidTypesType
    } & {
      required?: boolean
    }
  >
}

type RouterMethodeType = {
  get: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  post: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  put: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  patch: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  delete: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  options: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  head: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
  connect: (
    path: string,
    handler: ControllerType,
    options?: ControllerOptionType
  ) => void
}

type RouterRoutesType = {
  main: RoutesType
  dynamic: DynamicRoutesType[]
}
type ReadOnlyRouterRoutesType = {
  main: RoutesType
  dynamic: readonly DynamicRoutesType[]
}

export type {
  MethodsType,
  ControllerType,
  KeyValType,
  DynamicRoutesType,
  RoutesType,
  RouterMethodeType,
  RouterRoutesType,
  ReadOnlyRouterRoutesType,
  ErrorControllerType,
  ControllerOptionType,
  ValidTypesType,
}
