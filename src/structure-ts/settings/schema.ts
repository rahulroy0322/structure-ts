import Joi from 'joi';

import type {
  DatabaseType,
  MySqlDatabaseType,
  SettingsType,
} from '../../@types';
import { MIN_PORT_NUMBER } from '../constents';

const func = Joi.func();
const str = Joi.string();

const mySqlDataBaseSchema = Joi.object<MySqlDatabaseType>({
  mode: 'mysql',
  auth: Joi.object<MySqlDatabaseType['auth']>({
    host: str.required(),
    password: str.required(),
    user: str.required(),
    database: str.required(),
  }),
});

const DATABASE = Joi.object<DatabaseType>({
  config: Joi.alternatives(mySqlDataBaseSchema).required(),
  onSuccess: func,
});

const settingsSchema = Joi.object<SettingsType>({
  PORT: Joi.number().min(MIN_PORT_NUMBER).required(),
  APPS: Joi.array().items(str).required(),
  ADMIN_PANEL_URL: str.required(),
  NOT_FOUND_CONTROLLER: func.required(),
  ERROR_CONTROLLER: func.required(),
  DATABASE: DATABASE.required(),
});

export { settingsSchema };
