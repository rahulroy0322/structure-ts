import path from 'node:path';

import type { ReadOnlyRouterRoutesType } from '../../../@types';
import { ERROR_EXIT_CODE } from '../../constents';
import { BASE_DIR } from '../../settings';
import { routeSchema } from './schema';

const checkRoute = async <T>(app: string) => {
  const route = path
    .relative(__dirname, `${BASE_DIR}/${app}/routes`)
    .replace(/\\/gi, '/');

  const { default: routes } = await import(route);

  const { error, warning } = routeSchema.validate(routes);

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
