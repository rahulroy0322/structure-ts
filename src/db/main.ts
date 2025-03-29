import mysql, { type ConnectionOptions } from 'mysql2/promise';

import { ERROR_EXIT_CODE } from '../structure-ts/constents/exit-code.js';

const access: ConnectionOptions = {
  host: 'localhost',
  user: 'root',
  password: 'passwd',
  database: 'test',
};

let db: mysql.Connection;

const main = async () => {
  try {
    db = await mysql.createConnection(access);
  } catch (e) {
    console.error(e);
    process.exit(ERROR_EXIT_CODE);
  }
};

main();

export { db };
