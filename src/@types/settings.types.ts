import type { ControllerType, ErrorControllerType } from './router.types';

type MySqlDatabaseType = {
  mode: 'mysql';
  auth: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
};
type DatabaseType =
  | false
  | {
      onSuccess?: () => void;
      config: MySqlDatabaseType;
    };

type SettingsType = {
  PORT: number;
  APPS: string[];
  // ADMIN_PANEL_URL: string;
  NOT_FOUND_CONTROLLER?: ControllerType<unknown>;
  ERROR_CONTROLLER?: ErrorControllerType<unknown>;
  DATABASE: DatabaseType;
  TEMPLATE_DIR?: string;
};

export type { DatabaseType, SettingsType, MySqlDatabaseType };
