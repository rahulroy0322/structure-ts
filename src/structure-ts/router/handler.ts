import type { ObjectSchema } from 'joi';

import type {
  ControllerType,
  MethodsType,
  QuestionType,
  ReadOnlyRouterRoutesType,
  ReplyType,
} from '../../@types';
import { getCleanResponseUrl, getParams } from './utils';

const Handler = <T>({ main: routes, dynamic }: ReadOnlyRouterRoutesType<T>) => {
  type HandlerReturnType =
    | {
        success: true;
      }
    | {
        success: false;
        error?: unknown;
        notFound?: boolean;
        required?: string;
      };

  type ControllerReturnType = {
    controller: ControllerType<T>;
    body: ObjectSchema | null;
  };

  const getControllerForUrl = (
    url: string,
    method: MethodsType
  ): ControllerReturnType | false => {
    if (!routes[url]) {
      return false;
    }
    const route = routes[url];

    return route[method] || false;
  };

  const getControllerForDynamicUrl = (
    url: string,
    method: MethodsType
  ): ControllerReturnType | boolean => {
    const urlIndex = 0;
    const methodIndex = 2;
    method = method.toLowerCase() as MethodsType;

    for (const route of dynamic) {
      if (!route[urlIndex].test(url)) {
        continue;
      }
      if (route[methodIndex].toLowerCase() !== method) {
        continue;
      }
      const [regexp, keys, , controller, { body }] = route;

      const params = getParams(
        {
          regexp,
          keys,
        },
        url
      );

      return params === false ? true : { controller, body };
    }

    return false;
  };

  const getController = (url: string, method: MethodsType) => {
    const controller = getControllerForUrl(url, method);

    if ((controller as ControllerReturnType)?.controller) {
      return controller as ControllerReturnType;
    }
    const dynamicController = getControllerForDynamicUrl(url, method);

    if ((dynamicController as ControllerReturnType)?.controller) {
      return dynamicController as ControllerReturnType;
    }

    if (dynamicController === true) {
      throw new Error('something went wrong');
    }

    return false;
  };

  const handleImpl = async (
    question: QuestionType,
    reply: ReplyType<T>
  ): Promise<HandlerReturnType> => {
    const method = question.method();

    const url = getCleanResponseUrl(question.url() || '/');

    try {
      const res = getController(url, method);

      if (res === false) {
        return {
          success: false,
          notFound: true,
        };
      }

      const { body, controller } = res;

      if (body) {
        const { body: _body } = await question.body();
        const { error } = body.validate(_body);
        if (error) {
          return {
            success: false,
            required: error.details.map((value) => value.message).join('\n'),
          };
        }
      }

      controller(question, reply);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  };

  const handel = async (
    qestion: QuestionType,
    reply: ReplyType<T>
  ): Promise<HandlerReturnType> => await handleImpl(qestion, reply);

  return {
    handel,
  };
};

export { Handler };
