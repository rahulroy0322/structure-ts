import type { ResultSetHeader } from 'mysql2/promise';
import Sql from 'sql';

import type {
  FieldDefinitionType,
  FieldType,
  ModelDefinationType,
  PKType,
  SelectType,
  SqlColumnsType,
  SqlSchemaType,
} from '../../@types';
import { db } from '../main';

const INT_DEFAULT = 11;
const STR_DEFAULT = 255;
const BOOL_DEFAULT = 1;

const sqlField = (
  type: FieldType,
  lenght = type === 'int'
    ? INT_DEFAULT
    : type === 'bool'
      ? BOOL_DEFAULT
      : STR_DEFAULT
) => {
  switch (type) {
    case 'str':
      return {
        dataType: `VARCHAR(${lenght})`,
        transfrom(val: unknown) {
          return String(val);
        },
      };
    case 'int':
      return {
        dataType: `INT(${lenght})`,
        transfrom(val: unknown) {
          return Number(val);
        },
      };
    case 'bool':
      return {
        dataType: `TINYINT(${lenght})`,
        transfrom(val: unknown) {
          return Boolean(val);
        },
      };
    // case "date":
    // case "obj":
    // case "arr":
    default:
      throw new TypeError(`invalid type "${type}"`);
  }
};

const getSqlField = (val: FieldDefinitionType | FieldType) => {
  return sqlField(typeof val === 'string' ? val : val.type);
};

const getSqlSchema = <T>(name: string, value: ModelDefinationType<T>) => {
  const schema: SqlSchemaType<T> = {} as SqlSchemaType<T>;

  const columns: SqlColumnsType<typeof name, T> = {} as SqlColumnsType<
    typeof name,
    T
  >;

  for (const key in value) {
    const val = value[key] as FieldDefinitionType | FieldType;

    const { dataType, transfrom } = getSqlField(val);

    columns[key] = {
      dataType,
    };

    schema[key] = {
      transfrom,
      type: dataType,
    };

    if ((val as FieldDefinitionType)?.required !== undefined) {
      schema[key].required = (val as FieldDefinitionType).required;
    }
    if ((val as FieldDefinitionType)?.default !== undefined) {
      schema[key].default = (val as FieldDefinitionType).default;
    }
    if ((val as FieldDefinitionType)?.unique !== undefined) {
      schema[key].unique = (val as FieldDefinitionType).unique;
    }
    if ((val as FieldDefinitionType)?.pk !== undefined) {
      schema[key].pk = (val as FieldDefinitionType).pk;
    }
  }

  const sql = Sql.define<typeof name, T>({
    schema: '',
    columns,
    name,
  });

  return {
    schema,
    sql,
  };
};

const getSqlSelect = <
  T extends {
    pk: PKType;
  },
>(
  select: SelectType<T>,
  sql: Sql.Table<string, T>
): Sql.Query<T> => {
  if (select.length) {
    const set = [...new Set(select)];
    const first = set.shift();

    const _sql = sql.select(sql[first as keyof T]) as Sql.Query<T>;

    for (const key of set) {
      _sql.select(sql[key]);
    }

    return _sql;
  }
  return sql.select(sql.star());
};

const transfromSqlQuery = (query: string) =>
  query.replace(/\$[0-9]+/gi, '?').replace(/["']/gi, '`');
// .replace(/[\"\']/gi, '`')

const runSql = async <RT = ResultSetHeader>(
  query: string,
  values: unknown[] = []
): Promise<RT> => {
  const [res] = (await db.query(query, values)) as unknown as [RT];

  return res;
};

export { getSqlSchema, getSqlSelect, transfromSqlQuery, runSql };
