import type {
  ControllerType,
  ErrorControllerType,
  ServerOptionsType,
  ServerRespnsceType,
} from '../@types';
import { main } from '../db/main';
import { checkApps } from './app';
import { DEFAULT_OPTIONS } from './config';
import { ERROR_EXIT_CODE, SUCCESS_EXIT_CODE } from './constents';
import StructureImpl from './main';
import { Handler } from './router';
import SETTINGS, { BASE_DIR } from './settings';

const baseDir = BASE_DIR;
const errorController =
  SETTINGS.ERROR_CONTROLLER! as ErrorControllerType<ServerRespnsceType>;
const notFoundController =
  SETTINGS.NOT_FOUND_CONTROLLER as ControllerType<ServerRespnsceType>;
const templateDir = SETTINGS.TEMPLATE_DIR!;

const { PORT, APPS, DATABASE } = SETTINGS;

const Structure = async <T = ServerRespnsceType>(
  opts: ServerOptionsType = DEFAULT_OPTIONS
) => {
  if (DATABASE) {
    await main();
  }
  const routes = await checkApps<T>(baseDir, APPS);

  const { handel } = Handler<T>(routes);

  const { listen } = StructureImpl(
    {
      baseDir,
      templateDir,
      errorController,
      notFoundController,

      onClose,
      handel,
      port: PORT,
    },
    opts
  );

  return {
    listen,
  };
};

const onClose = (e: Error | undefined) => {
  if (e) {
    //TODO: Debug for error
    process.exit(ERROR_EXIT_CODE);
  }
  process.exit(SUCCESS_EXIT_CODE);
};

export * from './status';
export * from './router';
export { Structure };
export default Structure;
