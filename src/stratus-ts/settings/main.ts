import path from 'node:path'

import type { SettingsType } from '../../@types'
import { errorController } from '../controllers/error'
import { notFoundController } from '../controllers/not-found'

const APP_PATH = process.cwd()

const ENV = process.env.ENV || 'dev'
const IS_DEV = ENV === 'dev'

const getProjectDir = () => {
  switch (ENV as 'prod' | 'test' | 'dev') {
    case 'prod':
      return 'dist'
    case 'test':
      return 'tests'
    case 'dev':
      return 'src'
    default:
      throw new Error(`${ENV} not suppoted yet`)
  }
}

const BASE_DIR = path.join(APP_PATH, getProjectDir())
const settingsPath = path.join(BASE_DIR, 'settings')

// const data = getSetting();

// if (!data.success) {
//   console.error('setting not found!');
//   process.exit(ERROR_EXIT_CODE);
// }

// const {
//   error,
//   value: SETTINGS,
//   warning,
// } = settingsSchema.validate(data.setting);

// if (error) {
//   console.error('invalid setting!');
//   console.error(error);
//   process.exit(ERROR_EXIT_CODE);
// }

// if (warning) {
//   console.warn(warning);
// }

let SETTINGS: null | Required<SettingsType> = null

const loadSettings = async () => {
  if (!SETTINGS) {
    // todo validate
    SETTINGS = (await import(settingsPath)).default as Required<SettingsType>

    if (!SETTINGS.ERROR_CONTROLLER) {
      SETTINGS.ERROR_CONTROLLER = errorController
    }

    if (!SETTINGS.NOT_FOUND_CONTROLLER) {
      SETTINGS.NOT_FOUND_CONTROLLER = notFoundController
    }
  }

  return SETTINGS
}

export { IS_DEV, BASE_DIR, APP_PATH, SETTINGS, loadSettings }
