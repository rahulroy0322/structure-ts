import type { ServerOptionsType } from '../@types';

const DEFAULT_OPTIONS = {
  keepAlive: true,
  keepAliveTimeout: 5000,
  requestTimeout: 5000,
} satisfies ServerOptionsType;

export { DEFAULT_OPTIONS };
