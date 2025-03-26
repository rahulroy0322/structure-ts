import type { SettingsType } from '../../@types';
import { ERROR_EXIT_CODE } from '../constents';
import { errorController, notFoundController } from '../controllers';
import { settingsSchema } from './schema';

const getSetting = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: s } = require(`${BASE_DIR}/settings`);

    const setting = s as SettingsType;

    if (!setting.NOT_FOUND_CONTROLLER) {
      setting.NOT_FOUND_CONTROLLER = notFoundController;
    }

    if (!setting.ERROR_CONTROLLER) {
      setting.ERROR_CONTROLLER = errorController;
    }

    return {
      success: true,
      setting,
    };
  } catch {
    return {
      success: false,
    };
  }
};

const APP_PATH = process.cwd();

const ENV = process.env.NODE_ENV || 'dev';
const IS_PROD = ENV === 'prod';
const BASE_DIR = `${APP_PATH}/${IS_PROD ? 'dist' : 'src'}`;

const data = getSetting();

if (!data.success) {
  console.error('setting not found!');
  process.exit(ERROR_EXIT_CODE);
}

const {
  error,
  value: SETTINGS,
  warning,
} = settingsSchema.validate(data.setting);

if (error) {
  console.error('invalid setting!');
  console.error(error);
  process.exit(ERROR_EXIT_CODE);
}

if (warning) {
  console.warn(warning);
}

export { ENV, IS_PROD, BASE_DIR };

export default SETTINGS as SettingsType;
