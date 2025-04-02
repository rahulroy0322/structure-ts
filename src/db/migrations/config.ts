import { APP_PATH } from '../../structure-ts/settings';

const MIGRATION_DIR = `${APP_PATH}/.migrations`;
const SQL_DIR = `${MIGRATION_DIR}/sql`;
const MANEGER_FILE = `${MIGRATION_DIR}/main.json`;

const MIGRATION_TABLE = '__migrations';

export { MIGRATION_DIR, SQL_DIR, MANEGER_FILE, MIGRATION_TABLE };
