type DefaultSchemaType = {
  unique?: boolean
  select?: boolean
  required?: boolean
  default?: unknown
}

type MinMaxSchemaType = {
  min?: number
  max?: number
}

type StrSchemaType = {
  type: 'string' | 'email'
  default?: string
}

type NumSchemaType = {
  type: 'number'
  default?: number
}

type BoolSchemaType = {
  type: 'bool'
  default?: boolean
}

type TimestampSchemaType = {
  type: 'timestamp'
  default?: 'now' | Date
  onupdate?: true
}

type EnumSchemaType<F> = F extends {
  type: 'enum'
  values: infer Values extends readonly string[]
}
  ? {
      type: 'enum'
      values: Values
      default?: Values[number]
    }
  : never

type FieldSchemaType<F> = DefaultSchemaType &
  (
    | ((StrSchemaType | NumSchemaType) & MinMaxSchemaType)
    | BoolSchemaType
    | TimestampSchemaType
    | EnumSchemaType<F>
  )

export type { FieldSchemaType, DefaultSchemaType, EnumSchemaType }
