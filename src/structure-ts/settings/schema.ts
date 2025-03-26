import Joi from 'joi';

import type { SettingsType } from '../../@types';
import { MIN_PORT_NUMBER } from '../constents';

const func = Joi.func();

const settingsSchema = Joi.object<SettingsType>({
  PORT: Joi.number().min(MIN_PORT_NUMBER).required(),
  APPS: Joi.array().items(Joi.string()).required(),
  ADMIN_PANEL_URL: Joi.string().required(),
  NOT_FOUND_CONTROLLER: func.required(),
  ERROR_CONTROLLER: func.required(),
});

export { settingsSchema };
