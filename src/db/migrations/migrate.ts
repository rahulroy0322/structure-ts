/* eslint-disable no-console */
import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Sql from 'sql';
import { uid } from 'uid/secure';

import { ERROR_EXIT_CODE } from '../../structure-ts/constents';
import SETTINGS from '../../structure-ts/settings';
import { transfromSqlQuery } from '../sql';
import { MANEGER_FILE, MIGRATION_TABLE, SQL_DIR } from './config';
import type { StateType } from './types';

const { DATABASE } = SETTINGS;

const LAST_MIGRATION_INCRESOR = 1;
const QUERY_LIMIT = 1;
const DEFAULT_INDEX_OF_MIGRATION = 0;

type MigrationTableType = {
  pk: string;
  name: string;
  time: Date;
};

const migrationTable = Sql.define<string, MigrationTableType>({
  schema: '',
  name: MIGRATION_TABLE,
  columns: {
    pk: {
      dataType: '',
    },
    name: {
      dataType: '',
    },
    time: {
      dataType: '',
    },
  },
});

const main = async () => {
  try {
    const lastMigrations = await getLastMigration();
    const [lastMigration] = lastMigrations;

    const { default: maneger } = (await import(
      `./${path.relative(__dirname, `${MANEGER_FILE}`)}`
    )) as {
      default: StateType;
    };

    const lastMigratedIndex = lastMigration
      ? maneger.migrations.findIndex((m) => m === lastMigration.name)
      : DEFAULT_INDEX_OF_MIGRATION;

    const newMigrations = maneger.migrations.slice(
      lastMigratedIndex + LAST_MIGRATION_INCRESOR
    );
    if (newMigrations.length) {
      for (const name of newMigrations) {
        // eslint-disable-next-line no-await-in-loop
        const sqlQuerys = (await readFile(`${SQL_DIR}/${name}.sql`))
          .toString()
          .split('--> statement-breakpoint')
          .map((query) => query);

        for (const query of sqlQuerys) {
          // eslint-disable-next-line no-await-in-loop
          await db.execute(query);
        }

        const { text, values } = migrationTable
          .insert({
            pk: uid(),
            name,
          } as unknown as MigrationTableType)
          .toQuery();

        // eslint-disable-next-line no-await-in-loop
        await db.execute(transfromSqlQuery(text), values);
      }
      console.log('migrations compleate succesfully!');
    } else {
      console.log('nothing to migrate!');
    }
  } catch (e) {
    console.error(e);
  }
};

let db: mysql.Connection;

const loadConnection = async () => {
  if (db !== undefined) {
    return db;
  }
  try {
    db = await mysql.createConnection(DATABASE.config.auth);
    return db;
  } catch (e) {
    console.error(e);
    process.exit(ERROR_EXIT_CODE);
  }
};

let tried = false;

const getLastMigration = async () => {
  try {
    await loadConnection();

    const { text, values } = migrationTable
      .select(migrationTable.name)
      .order([migrationTable.time.desc])
      .limit(QUERY_LIMIT)
      .toQuery();

    const [res] = await db.execute(transfromSqlQuery(text), values);
    return res as { name: string }[];
  } catch (e) {
    if (tried) {
      console.error(e);
      process.exit(ERROR_EXIT_CODE);
    }
    await db.execute(
      transfromSqlQuery(
        `create table \`${MIGRATION_TABLE}\`(
                        pk varchar(30) primary key,
                        name varchar(255) not null,
                        time TIMESTAMP default CURRENT_TIMESTAMP
                    );`
      )
    );
    tried = true;
    return await getLastMigration();
  }
};

// if (require.main === module) {
//     main();
// }

export { main };
