import type { FilterModelType } from '../../model/filter.types'
import type { SchemaType } from '../../model/utils.types'

type DatabaseMongoCompiler = {
  filter<S extends SchemaType>(
    where: Partial<FilterModelType<S>>,
    params?: unknown[]
  ): Partial<FilterModelType<S>>
}

export type { DatabaseMongoCompiler }
