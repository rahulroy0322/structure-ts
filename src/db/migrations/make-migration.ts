import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ERROR_EXIT_CODE } from '../../structure-ts/constents';
import SETTINGS, { APP_PATH, BASE_DIR } from '../../structure-ts/settings';
import type {
  ColumnSchemaType,
  IndexSchemaType,
  ModelType,
  StateType,
  TableSchemaType,
} from './types';

const MIGRATION_DIR = `${APP_PATH}/.migrations`;
const SQL_DIR = `${MIGRATION_DIR}/sql`;
const MANEGER_FILE = `${MIGRATION_DIR}/main.json`;

const LAST_ITEM = -1;
const { APPS } = SETTINGS;

const loadManeger = async (): Promise<StateType> => {
  if (existsSync(MANEGER_FILE)) {
    const content = await readFile(MANEGER_FILE);
    return JSON.parse(content.toString()) as StateType;
  }
  return {
    at: 0,
    tables: [],
    migrations: [],
  } satisfies StateType;
};

const saveManeger = async (state: StateType) =>
  await writeFile(MANEGER_FILE, JSON.stringify(state));

const saveSql = async (path: string, sql: string) => {
  const _path = `${SQL_DIR}/${path}.sql`;
  if (!existsSync(SQL_DIR)) {
    await mkdir(_path);
  }
  await writeFile(_path, sql);

  return path;
};

const getNewState = (
  models: ModelType[],
  migrations: string[],
  name?: string
): StateType => {
  const tables = models.map(({ name, schema }) =>
    Object.entries(schema).reduce(
      (acc, [key, { type, default: d, required, pk, unique }]) => {
        acc.columns.push({
          type,
          key,
          default: d as string,
          required,
          pk,
        });

        if (unique !== undefined) {
          acc.indexes.push({
            key,
            name: `idx-${key}`,
            unique,
          });
        }

        return acc;
      },
      {
        name,
        columns: [] as ColumnSchemaType[],
        indexes: [] as IndexSchemaType[],
      } satisfies TableSchemaType
    )
  );

  const at = Date.now();

  if (!name) {
    name = at.toString();
  }

  migrations.push(name);

  return {
    tables,
    at,
    migrations,
  } satisfies StateType;
};

const generateColumnDefinition = (col: ColumnSchemaType) => {
  const sqls = [`\`${col.key}\``];
  sqls.push(`${col.type}`);
  if (col.pk) {
    sqls.push('PRIMARY KEY');
  }
  if (col.required) {
    sqls.push('NOT NULL');
  }
  if (col.default !== undefined) {
    sqls.push(`DEFAULT ${col.default}`);
  }
  return sqls.join('\t');
};

const generateCreateTableSQL = (table: TableSchemaType) => {
  const sqls = [`CREATE TABLE \`${table.name}\` (`];

  const cols = table.columns
    .map((col) => `\t${generateColumnDefinition(col)}`)
    .join(',\n');

  sqls.push(cols);
  sqls.push(');');

  const indexes = table.indexes
    .map((index) =>
      [
        'CREATE',
        index.unique ? 'UNIQUE INDEX' : 'INDEX',
        `\`${index.name}\``,
        'ON',
        `\`${table.name}\``,
        `(\`${index.key}\`);`,
      ].join('\t')
    )
    .join('\n');

  sqls.push(indexes);

  return sqls.join('\n');
};

const generateAlterTableSQL = (
  oldTable: TableSchemaType,
  newTable: TableSchemaType
) => {
  const sqls = [`-- Changes for table \`${newTable.name}\``];

  // Detect new columns
  const newColumns = newTable.columns.filter(
    (newCol) => !oldTable.columns.some((c) => c.key === newCol.key)
  );

  // Detect dropped columns
  const droppedColumns = oldTable.columns.filter(
    (oldCol) => !newTable.columns.some((c) => c.key === oldCol.key)
  );

  // Detect modified columns
  const modifiedColumns = newTable.columns.filter((newCol) => {
    const oldCol = oldTable.columns.find((c) => c.key === newCol.key);
    return oldCol && JSON.stringify(oldCol) !== JSON.stringify(newCol);
  });

  // Generate ALTER TABLE statements
  sqls.push(
    newColumns
      .map((newColumn) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.name}\``,
          'ADD',
          'COLUMN',
          generateColumnDefinition(newColumn),
          ';',
        ].join('\t')
      )
      .join('\n')
  );

  sqls.push(
    droppedColumns
      .map((droppedColumn) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.name}\``,
          'DROP',
          'COLUMN',
          `\`${droppedColumn.key}\`;`,
        ].join('\t')
      )
      .join('\n')
  );

  sqls.push(
    modifiedColumns
      .map((modifiedColumn) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.name}\``,
          'MODIFY',
          'COLUMN',
          generateColumnDefinition(modifiedColumn),
          ';',
        ].join('\t')
      )
      .join('\n')
  );

  return sqls.join('\n');
};

const getSql = (currentState: StateType, newState: StateType) => {
  const sqls = [`-- Migration '${newState.at}'`];

  // Detect new tables
  const newTables = newState.tables.filter(
    (newTable) => !currentState.tables.some((t) => t.name === newTable.name)
  );

  // Detect dropped tables
  const droppedTables = currentState.tables.filter(
    (oldTable) => !newState.tables.some((t) => t.name === oldTable.name)
  );

  // Generate SQL for new tables
  newTables.map((table) => {
    sqls.push(generateCreateTableSQL(table));
    sqls.push('\n');
  });

  // Generate SQL for dropped tables
  droppedTables.map((table) => {
    sqls.push(`DROP TABLE IF EXISTS \`${table.name}\`;`);
    sqls.push('\n');
  });

  // Detect altered tables (simplified)
  newState.tables.map((newTable) => {
    const oldTable = currentState.tables.find((t) => t.name === newTable.name);
    if (oldTable) {
      sqls.push(generateAlterTableSQL(oldTable, newTable));
    }
  });

  return sqls.join('\n');
};

const generate = async (models: ModelType[], migrationName?: string) => {
  const currentState = await loadManeger();

  const newState = getNewState(models, currentState.migrations, migrationName);

  if (JSON.stringify(currentState.tables) !== JSON.stringify(newState.tables)) {
    const path = await saveSql(
      newState.migrations.at(LAST_ITEM)!.toString(),
      getSql(currentState, newState)
    );
    await saveManeger(newState);

    return path;
  }

  return false;
};

const make = async (migrationName?: string) => {
  const models = (await getAllModels()).reduce((acc, curr) => {
    acc.push(
      ...Object.values(curr).map(({ name, schema }) => ({
        name,
        schema,
      }))
    );
    return acc;
  }, [] as ModelType[]);

  if (!existsSync(MIGRATION_DIR)) {
    await mkdir(MIGRATION_DIR);
  }
  if (!existsSync(SQL_DIR)) {
    await mkdir(SQL_DIR, { recursive: true });
  }

  return await generate(models, migrationName);
};

const getAllModels = async () => {
  return await Promise.all(
    APPS.map(async (app) => {
      try {
        return (await import(
          `./${path.relative(__dirname, `${BASE_DIR}/${app}/model`)}`
        )) as Record<string, ModelType>;
      } catch (err) {
        console.error(err);
        process.exit(ERROR_EXIT_CODE);
      }
    })
  );
};

const main = async () => {
  const path = await make();

  if (path) {
    // eslint-disable-next-line no-console
    console.log(`Migration generated at "${path}"`);
  } else {
    // eslint-disable-next-line no-console
    console.log('Nothing modified to generated migration!');
  }
};

if (require.main === module) {
  main();
}
