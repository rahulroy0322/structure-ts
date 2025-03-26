import { METHODS } from 'node:http';

import type {
  ControllerType,
  MethodsType,
  ReadOnlyRouterRoutesType,
  RouterMethodeType,
  RouterRoutesType,
  ServerRespnsceType,
} from '../../@types';
import { getCleanPath, getRegexpFromUrl } from './utils';

const methods = METHODS.map((method) => method.toLowerCase()) as MethodsType[];

const DELIMITER = '<';
const CATCH_ALL = '*';

const Router = <T = ServerRespnsceType>(baseUrl = '') => {
  const routes = {
    main: {},
    dynamic: [],
  } as RouterRoutesType<T>;

  const route: RouterMethodeType<T> = {
    get: (path, handler) => _route(path, 'get', handler),
    post: (path, handler) => _route(path, 'post', handler),
    patch: (path, handler) => _route(path, 'patch', handler),
    put: (path, handler) => _route(path, 'put', handler),
    delete: (path, handler) => _route(path, 'delete', handler),
    head: (path, handler) => _route(path, 'head', handler),
    options: (path, handler) => _route(path, 'options', handler),
    connect: (path, handler) => _route(path, 'connect', handler),
  };

  const _route = (
    path: string,
    methode: MethodsType,
    controller: ControllerType<T>
  ) => {
    const notPresent = -1;

    if (!methods.includes(methode)) {
      console.error('Methode Not Allowed!');
      process.exit();
    }

    path = getCleanPath(baseUrl, path);

    if (
      path.indexOf(DELIMITER) === notPresent &&
      path.indexOf(CATCH_ALL) === notPresent
    ) {

      if(!routes.main[path]){
        routes.main[path]={}
      }

      (routes.main[path]!)[methode]= controller

      return;
    }

    const { regexp, keys } = getRegexpFromUrl(path);

    // [RegExp, KeyValType[], MethodsType, ControllerType<T>]
    routes.dynamic.push([regexp, keys, methode, controller]);
  };

  return {
    route,
    routes: routes as ReadOnlyRouterRoutesType<T>,
    ...route,
  };
};

export { Router };
