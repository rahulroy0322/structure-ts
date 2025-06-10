import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { ReadOnlyRouterRoutesType, RouterRoutesType } from '../../@types';
import { ERROR_EXIT_CODE } from '../constents';
import { checkRoute } from './routes';

const REQUIRED_FILES = [
  'routes',
  'controllers',
  // 'services.ts',
] as const;

const checkApps = async <T>(baseDir: string, apps: string[]) => {
  // let routes = {} as ReadOnlyRouterRoutesType<T>;

  const routes = await Promise.all(
    apps.map(async (app) => {
      try {
        const files = await getAppAllFiles(baseDir, app);

        checkRequiredFiles(app, files);

        const route = await checkSchemaFiles<T>(baseDir, app);

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

const checkSchemaFiles = async <T>(baseDir: string, app: string) => {
  const routes = await checkRoute(baseDir, app);

  return routes as ReadOnlyRouterRoutesType<T>;
};

const checkRequiredFiles = (app: string, files: string[]) =>
  REQUIRED_FILES.forEach((file) => {
    if (!files.includes(file)) {
      throw new Error(`"${file}" file does not exists at "${app}" app!`);
    }
  });

const getAppAllFiles = async (baseDir: string, app: string) => {
  const appPath = path.join(baseDir, app);

  if (!fs.existsSync(appPath)) {
    throw new Error(`app "${app}" does not exists!`);
  }

  return (await fsp.readdir(appPath)).map((file) =>
    file.replace('.ts', '').replace('.js', '')
  );
};

export { checkApps };
