import mysql from 'mysql2/promise';

import { ERROR_EXIT_CODE } from '../structure-ts/constents/exit-code.js';
import SETTINGS from '../structure-ts/settings/main.js';

const { config, onSuccess } = SETTINGS.DATABASE;

let db: mysql.Connection;

const main = async () => {
  try {
    db = await mysql.createConnection(config.auth);
    onSuccess?.();
  } catch (e) {
    console.error(e);
    process.exit(ERROR_EXIT_CODE);
  }
};

main();

export { db };
