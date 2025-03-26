import type {
  ControllerType,
  MethodsType,
  QuestionType,
  ReadOnlyRouterRoutesType,
  ReplyType,
} from '../../@types';
import { getCleanResponseUrl, getParams, } from './utils';

const Handler = <T>({ main: routes, dynamic }: ReadOnlyRouterRoutesType<T>) => {
  type HandlerReturnType =
    | {
        success: true;
      }
    | {
        success: false;
        error?: unknown;
        notFound?: boolean;
      };



  const getControllerForUrl = (
    url: string,
    method: MethodsType
  ): ControllerType<T> | false => {
    if (!routes[url]) {
      return false;
    }
    const route = routes[url];
    const controller = route[method];

    return controller || false;
  };

  const getControllerForDynamicUrl = (
    url: string,
    method: MethodsType
  ): ControllerType<T> | boolean => {
    const urlIndex = 0;
    const methodIndex = 2;
         
    for (const route of dynamic) {
      if (!route[urlIndex].test(url)) {
        continue;
      }
      if (route[methodIndex] !== method) {
        continue;
      }
      const [regexp, keys, , controller] = route;

      const params = getParams(
        {
          regexp,
          keys,
        },
        url
      );

      return params === false ? true : controller;
    }

    return false;
  };

  const getController = (url: string, method: MethodsType) => {
    const controller = getControllerForUrl(url, method);

    if (typeof controller === 'function') {
      return controller;
    }
    const dynamicController = getControllerForDynamicUrl(url, method);

    if (typeof dynamicController === 'function') {
      return dynamicController;
    }

    if (dynamicController === true) {
      throw new Error('something went wrong');
    }

    return false;
  };

  const handleImpl = (
    question: QuestionType,
    reply: ReplyType<T>
  ): HandlerReturnType => {
    const method = question.method();

    const url = getCleanResponseUrl(question.url() || '/');

    try {
      const controller = getController(url, method);

      if (controller === false) {
        return {
          success: false,
          notFound: true,
        };
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

  const handel = (
    qestion: QuestionType,
    reply: ReplyType<T>
  ): HandlerReturnType => handleImpl(qestion, reply);

  return {
    handel,
  };
};


export { Handler };
