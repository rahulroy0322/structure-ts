import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { ReadOnlyRouterRoutesType, RouterRoutesType } from '../../@types';
import { ERROR_EXIT_CODE } from '../constents';
import SETTINGS, { BASE_DIR } from '../settings';
import { checkRoute } from './routes';

const REQUIRED_FILES = [
  'routes',
  'controllers',
  // 'services.ts',
] as const;

const { APPS } = SETTINGS;

const checkApps = async <T>() => {
  // let routes = {} as ReadOnlyRouterRoutesType<T>;

  const routes = await Promise.all(
    APPS.map(async (app) => {
      try {
        const files = await getAppAllFiles(app);

        checkRequiredFiles(app, files);

        const route = await checkSchemaFiles<T>(app);

        return route;
      } catch (err) {
        console.error(err);
        process.exit(ERROR_EXIT_CODE);
      }
    })
  );

  return routes.reduce(
    (acc, curr) => {
      if (curr.main) {
        acc.main = {
          ...acc.main,
          ...curr.main,
        };
      }

      if (curr.dynamic) {
        (acc.dynamic as RouterRoutesType<T>['dynamic']).push(...curr.dynamic);
      }

      return acc;
    },
    {
      main: {},
      dynamic: [],
    } as RouterRoutesType<T>
  );
};

const checkSchemaFiles = async <T>(app: string) => {
  const routes = await checkRoute(app);

  return routes as ReadOnlyRouterRoutesType<T>;
};

const checkRequiredFiles = (app: string, files: string[]) =>
  REQUIRED_FILES.forEach((file) => {
    if (!files.includes(file)) {
      throw new Error(`"${file}" file does not exists at "${app}" app!`);
    }
  });

const getAppAllFiles = async (app: string) => {
  const appPath = path.join(BASE_DIR, app);

  if (!fs.existsSync(appPath)) {
    throw new Error(`app "${app}" does not exists!`);
  }

  return (await fsp.readdir(appPath)).map((file) =>
    file.replace('.ts', '').replace('.js', '')
  );
};

export { checkApps };
