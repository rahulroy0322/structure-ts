import type { TableDefinition } from 'sql';

import type { FIELDS_TYPE } from '../db/constants/types';

// eslint-disable-next-line no-magic-numbers
type SINGLE_TYPE = 1;

type OptionsType = Partial<{
  required: boolean;
  unique: boolean;
  pk: boolean;
  default: unknown;
}>;

type FieldType = (typeof FIELDS_TYPE)[number];
type ValueType = string | number | boolean;

type FieldDefinitionType = {
  type: FieldType;
} & OptionsType;

type PKType = string;

type ModelDefinationType<T> = {
  [_key in keyof T]: FieldDefinitionType | FieldType;
};

type SelectType<T> = Partial<keyof T>[];
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type QueryOptionsType = {};

type FilterType<T> = {
  [_key in keyof T]:
    | ValueType
    | {
        $eq: ValueType;
      }
    | {
        $neq: ValueType;
      }
    | {
        $gt: number | Date;
      }
    | {
        $lt: number | Date;
      }
    | {
        $gte: number | Date;
      }
    | {
        $lte: number | Date;
      }
    | {
        $in: (string | number | Date)[];
      }
    | {
        $nin: (string | number | Date)[];
      }
    | {
        $like: string;
      };
};
// eslint-disable-next-line no-unused-vars
type PostType<T, RT> = (data: T) => Promise<RT | false>;

type PostOneType<T> = PostType<T, string>;
type PostManyType<T> = PostType<T[], string[]>;

type FetchType<T extends object, O extends object, RT> = (
  /* eslint-disable no-unused-vars */
  filter?: Partial<FilterType<T>>,
  select?: SelectType<T>,
  options?: Partial<O & QueryOptionsType>
  /* eslint-enable no-unused-vars */
) => Promise<RT>;

type FetchAllType<T extends object> = FetchType<
  T,
  {
    limit: number;
    skip: number;
  },
  T[]
>;

type FetchOneType<T extends object> = FetchType<
  T,
  {
    skip: number;
  },
  T | false
>;

type FetchByPkType<T extends object> = (
  /* eslint-disable no-unused-vars */
  pk: PKType,
  select?: SelectType<T>,
  options?: Partial<{} & QueryOptionsType>
  /* eslint-enable no-unused-vars */
) => ReturnType<FetchOneType<T>>;

type DestroyType<T extends object, O extends object, RT> = (
  /* eslint-disable no-unused-vars */
  filter?: Partial<FilterType<T>>,
  options?: Partial<O & QueryOptionsType>
  /* eslint-enable no-unused-vars */
) => Promise<RT | false>;

type DestroyManyType<T extends object> = DestroyType<
  T,
  {
    limit: number;
  },
  number
>;

type DestroyOneType<T extends object> = DestroyType<
  T,
  {
    limit: number;
  },
  SINGLE_TYPE
>;

type DestroyByPkType<T extends object> = (
  /* eslint-disable no-unused-vars */
  pk: PKType,
  options?: Partial<{} & QueryOptionsType>
  /* eslint-enable no-unused-vars */
) => ReturnType<DestroyOneType<T>>;

type PatchType<F, T, O extends object, RT> = (
  /* eslint-disable no-unused-vars */
  filter: Partial<FilterType<F>>,
  data: Partial<T>,
  options?: Partial<O & QueryOptionsType>
  /* eslint-enable no-unused-vars */
) => Promise<RT | false>;

type PatchManyType<T, T2> = PatchType<
  T2,
  T,
  {
    limit: number;
  },
  number
>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type PatchOneType<T, T2> = PatchType<T2, T, {}, SINGLE_TYPE>;

type PatchByPkType<T> = (
  /* eslint-disable no-unused-vars */
  pk: PKType,
  data: Partial<T>,
  options?: Partial<{} & QueryOptionsType>
  /* eslint-enable no-unused-vars */
) => Promise<SINGLE_TYPE | false>;

type ModelReturnType<T extends object, T2 extends object> = {
  post: {
    one: PostOneType<T>;
    many: PostManyType<T>;
  };
  destroy: {
    byPk: DestroyByPkType<T>;
    one: DestroyOneType<T2>;
    many: DestroyManyType<T2>;
  };
  fetch: {
    byPk: FetchByPkType<T2>;
    one: FetchOneType<T2>;
    all: FetchAllType<T2>;
  };
  patch: {
    byPk: PatchByPkType<T>;
    one: PatchOneType<T, T2>;
    many: PatchManyType<T, T2>;
  };
};

type ModelType = <T extends object>(
  /* eslint-disable no-unused-vars */
  tableName: string,
  tableDefination: ModelDefinationType<T>
  /* eslint-enable no-unused-vars */
) => ModelReturnType<
  T,
  T & {
    pk: PKType;
  }
>;

type SqlSchemaType<T> = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof T]: OptionsType & {
    type: string;
    // eslint-disable-next-line no-unused-vars
    transfrom(val: unknown): number | string | boolean;
  };
};

type SqlColumnsType<Name extends string, T> = TableDefinition<
  Name,
  T
>['columns'];

export type {
  ModelType,
  ModelDefinationType,
  ModelReturnType,
  FilterType,
  SqlSchemaType,
  SqlColumnsType,
  FieldDefinitionType,
  FieldType,
  PKType,
  SelectType,
};
