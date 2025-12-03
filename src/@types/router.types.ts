import type { ObjectSchema } from 'joi'

import type {
  ErrorRespnsceType,
  QuestionType,
  ReplyType,
  ServerRespnsceType,
} from '.'
import type { ParamsUtilType, Prettify } from './model/utils.types'

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
  ParamsType extends Record<string, unknown> = ParamsUtilType,
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

type HandlerType<P extends string> = ParamsFromStringType<P> extends never
  ? never
  : ControllerType<ParamsFromStringType<P>>

type RouteMethodeType = <P extends string>(
  path: P,
  cb: HandlerType<P>,
  options?: ControllerOptionType
) => void

type RouterMethodeType = {
  get: RouteMethodeType
  post: RouteMethodeType
  put: RouteMethodeType
  patch: RouteMethodeType
  delete: RouteMethodeType
  options: RouteMethodeType
  head: RouteMethodeType
  connect: RouteMethodeType
}

type RouterRoutesType = {
  main: RoutesType
  dynamic: DynamicRoutesType[]
}
type ReadOnlyRouterRoutesType = {
  main: RoutesType
  dynamic: readonly DynamicRoutesType[]
}

// ? for controller only
type ParamTypeFromStringType<S extends string> = S extends
  | 'int'
  | 'num'
  | 'integer'
  | 'number'
  ? number
  : S extends 'str' | 'txt' | 'text' | 'string' // ! TODO | 'uuid'
    ? string
    : S extends 'bool' | 'boolean'
      ? boolean
      : S extends 'true'
        ? true
        : S extends 'false'
          ? false
          : never

type IsFirstMatchType<
  S extends string,
  CharToMatch extends S | (string & {}),
> = S extends `${infer Fisrt}${string}`
  ? Fisrt extends CharToMatch
    ? S
    : never
  : never

type LastCharType<S extends string> = S extends `${infer First}${infer Rest}`
  ? Rest extends ''
    ? First
    : LastCharType<Rest>
  : never

type IsLastMatchType<
  S extends string,
  CharToMatch extends S | (string & {}),
> = CharToMatch extends LastCharType<S> ? S : never

// biome-ignore lint/complexity/noBannedTypes: ts only
type EmptyRecord = {}

type ParamsFromStringImplType<
  First extends string,
  Key extends string,
  Type extends string,
  End extends string,
> = First extends IsLastMatchType<First, '/'> | ''
  ? {
      [K in Key]: ParamTypeFromStringType<Type>
    } & ParamsFromStringType<End>
  : never

type ParamsFromStringType<P extends string> = Prettify<
  P extends `${infer Start}<${infer Key}:${infer Type}>${infer End}`
    ? End extends ''
      ? ParamsFromStringImplType<Start, Key, Type, End>
      : End extends IsFirstMatchType<End, '/'>
        ? ParamsFromStringImplType<Start, Key, Type, End>
        : never
    : EmptyRecord
>

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
