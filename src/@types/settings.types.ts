import type { ControllerType, ErrorControllerType } from './router.types';

type SettingsType = {
  PORT: number;
  APPS: string[];
  ADMIN_PANEL_URL: string;
  NOT_FOUND_CONTROLLER?: ControllerType<unknown>;
  ERROR_CONTROLLER?: ErrorControllerType<unknown>;
};

export type { SettingsType };
