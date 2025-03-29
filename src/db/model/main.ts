import { uid } from 'uid/secure';

import type {
  FilterType,
  ModelDefinationType,
  ModelReturnType,
  ModelType,
  PKType,
} from '../../@types';
import { ERROR_EXIT_CODE } from '../../structure-ts/constents/exit-code';
import {
  getSqlFilter,
  getSqlSchema,
  getSqlSelect,
  runSql,
  transfromSqlQuery,
} from '../sql';
import { schemaSchema, strSchema } from './schema';

const ONE_RESPONSE = 1;
const FIRST_INDEX = 0;

const validateNameAndSchema = (name: string, defination: unknown) => {
  if (strSchema.validate(name).error) {
    console.error('ERROR: name must be string');
    process.exit(ERROR_EXIT_CODE);
  }

  if (!name.endsWith('s')) {
    name = `${name}s`;
  }
  const { error, warning } = schemaSchema.validate(defination);

  if (warning) {
    console.warn(warning);
  }

  if (error) {
    console.error('ERROR:');
    console.error(error);
    process.exit(ERROR_EXIT_CODE);
  }

  return name;
};

const Model: ModelType = <T extends object>(
  tableName: string,
  tableDefination: ModelDefinationType<T>
) => {
  type _T = T & {
    pk: PKType;
  };

  tableName = validateNameAndSchema(tableName, tableDefination);

  const { sql, schema } = getSqlSchema<_T>(tableName, {
    ...tableDefination,
    pk: {
      type: 'str',
      required: true,
      unique: true,
      pk: true,
    },
  });

  const fetchAll: ModelReturnType<T, _T>['fetch']['all'] = async (
    filter = {},
    select = [],
    options = {}
  ) => {
    const _sql = getSqlSelect(select, sql);

    if (Object.keys(filter)) {
      for (const key in filter) {
        _sql.where(
          getSqlFilter(sql, key as keyof _T, filter[key as keyof _T]!)
        );
      }
    }

    if (options.limit) {
      _sql.limit(options.limit);
    }

    if (options.skip) {
      _sql.offset(options.skip);
    }

    const { text, values } = _sql.toQuery();

    const query = transfromSqlQuery(text);

    const items = await runSql<_T[]>(query, values);

    return items;
  };

  const fetchByPk: ModelReturnType<T, _T>['fetch']['byPk'] = async (
    pk,
    select = [],
    options = {}
  ) => {
    return await fetchOne(
      {
        pk,
      } as Partial<FilterType<_T>>,
      select,
      options
    );
  };

  const fetchOne: ModelReturnType<T, _T>['fetch']['one'] = async (
    filter = {},
    select = [],
    options = {}
  ) => {
    return (
      (await fetchAll(filter, select, { ...options, limit: 1 }))[FIRST_INDEX] ??
      false
    );
  };

  const postOne: ModelReturnType<T, _T>['post']['one'] = async (data) => {
    const pk = uid();

    const { text, values } = sql.insert({ ...data, pk } as _T).toQuery();

    const query = transfromSqlQuery(text);

    const res = await runSql(query, values);

    return res.affectedRows ? pk : false;
  };

  const postMany: ModelReturnType<T, _T>['post']['many'] = async (datas) => {
    const items = [] as _T[];

    for (const data of datas) {
      const pk = uid();

      const item = {
        ...data,
        pk,
      } satisfies _T;

      items.push(item);
    }

    const { text, values } = sql.insert(items).toQuery();

    const query = transfromSqlQuery(text);

    await runSql(query, values);

    return items.map(({ pk }) => pk);
  };

  const destroyMany: ModelReturnType<T, _T>['destroy']['many'] = async (
    filter = {},
    options = {}
  ) => {
    const _sql = sql.delete();

    if (Object.keys(filter)) {
      for (const key in filter) {
        _sql.where(
          getSqlFilter(sql, key as keyof _T, filter[key as keyof _T]!)
        );
      }
    }

    if (options.limit) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      _sql.limit(options.limit);
    }

    const { text, values } = _sql.toQuery();

    const query = transfromSqlQuery(text);

    const items = await runSql(query, values);

    return items.affectedRows || false;
  };

  const destroyOne: ModelReturnType<T, _T>['destroy']['one'] = async (
    filter = {},
    options = {}
  ) =>
    (await destroyMany(filter, {
      ...options,
      limit: 1,
    }))
      ? ONE_RESPONSE
      : false;

  const destroyByPk: ModelReturnType<T, _T>['destroy']['byPk'] = async (
    pk,
    options = {}
  ) => await destroyOne({ pk } as Partial<FilterType<_T>>, options);

  const patchMany: ModelReturnType<T, _T>['patch']['many'] = async (
    filter,
    data,
    options = {}
  ) => {
    const _sql = sql.update(data as _T);

    if (Object.keys(filter)) {
      for (const key in filter) {
        _sql.where(
          getSqlFilter(sql, key as keyof _T, filter[key as keyof _T]!)
        );
      }
    }

    if (options.limit) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      _sql.limit(options.limit);
    }

    const { text, values } = _sql.toQuery();

    const query = transfromSqlQuery(text);

    const items = await runSql(query, values);

    return items.affectedRows || false;
  };

  const patchOne: ModelReturnType<T, _T>['patch']['one'] = async (
    filter,
    data,
    options = {}
  ) =>
    (await patchMany(filter, data, { ...options, limit: 1 }))
      ? ONE_RESPONSE
      : false;

  const patchByPk: ModelReturnType<T, _T>['patch']['byPk'] = async (
    pk,
    data,
    options = {}
  ) => await patchOne({ pk } as FilterType<_T>, data, options);

  const res: ModelReturnType<T, _T> = {
    post: {
      one: postOne,
      many: postMany,
    },
    patch: {
      one: patchOne,
      byPk: patchByPk,
      many: patchMany,
    },
    destroy: {
      byPk: destroyByPk,
      one: destroyOne,
      many: destroyMany,
    },
    fetch: {
      byPk: fetchByPk,
      one: fetchOne,
      all: fetchAll,
    },
  } satisfies ModelReturnType<T, _T>;

  Object.assign(res, {
    schema,
    name: tableName,
  });

  return res as ModelReturnType<T, _T>;
};

export { Model };
