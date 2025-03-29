import type { QuestionType, ReplyType, ServerRespnsceType } from '.';

type MethodsType =
  | 'get'
  | 'post'
  | 'patch'
  | 'put'
  | 'delete'
  | 'options'
  | 'head'
  | 'connect';

/* eslint-disable no-unused-vars */
type ControllerType<ReplyT = ServerRespnsceType> = (
  question: QuestionType,
  reply: ReplyType<ReplyT>
) => void | Promise<void>;

type ErrorControllerType<ReplyT> = (
  error: unknown,
  question: QuestionType,
  reply: ReplyType<ReplyT>
) => void;
/* eslint-enable no-unused-vars */

type RoutesType<T> = Record<
  string,
  Partial<Record<MethodsType, ControllerType<T>>>
>;

type KeyValType = {
  kind: 'param';
  key: string;
  // eslint-disable-next-line no-unused-vars
  translator: (value: string) => number | boolean | string;
};

type DynamicRoutesType<T> = [
  RegExp,
  KeyValType[],
  MethodsType,
  ControllerType<T>,
];

/* eslint-disable no-unused-vars */
type RouterMethodeType<T> = {
  get: (path: string, handler: ControllerType<T>) => void;
  post: (path: string, handler: ControllerType<T>) => void;
  put: (path: string, handler: ControllerType<T>) => void;
  patch: (path: string, handler: ControllerType<T>) => void;
  delete: (path: string, handler: ControllerType<T>) => void;
  options: (path: string, handler: ControllerType<T>) => void;
  head: (path: string, handler: ControllerType<T>) => void;
  connect: (path: string, handler: ControllerType<T>) => void;
};
/* eslint-enable no-unused-vars */

type RouterRoutesType<T = ServerRespnsceType> = {
  main: RoutesType<T>;
  dynamic: DynamicRoutesType<T>[];
};
type ReadOnlyRouterRoutesType<T> = {
  main: RoutesType<T>;
  dynamic: readonly DynamicRoutesType<T>[];
};

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
};
