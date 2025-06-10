import path from 'node:path';

import type { ReadOnlyRouterRoutesType } from '../../../@types';
import { ERROR_EXIT_CODE } from '../../constents';
import { routeSchema } from './schema';

const checkRoute = async <T>(baseDir: string, app: string) => {
  const route = path
    .relative(__dirname, `${baseDir}/${app}/routes`)
    .replace(/\\/gi, '/');

  const { default: routes } = await import(route);

  const { error, warning } = routeSchema.validate(routes, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    console.error(`invalid app "${app}"!`);
    console.error(error);
    process.exit(ERROR_EXIT_CODE);
  }

  if (warning) {
    console.warn(warning);
  }

  return routes as ReadOnlyRouterRoutesType<T>;
};

export { checkRoute };
