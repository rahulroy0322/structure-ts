import type { SqlSchemaType } from '../../@types';

type ModelType = {
  name: string;
  schema: SqlSchemaType<{
    pk: string;
    email: string;
  }>;
};

type ColumnSchemaType = {
  key: string;
  type: string;
  required?: boolean;
  default?: string;
};

type IndexSchemaType = {
  name: string;
  key: string;
  unique: boolean;
  pk: boolean;
};

type TableSchemaType = {
  name: string;
  columns: ColumnSchemaType[];
  indexes: IndexSchemaType[];
};

type StateType = {
  at: number;
  tables: TableSchemaType[];
  migrations: string[];
};

export type {
  StateType,
  ModelType,
  TableSchemaType,
  ColumnSchemaType,
  IndexSchemaType,
};
