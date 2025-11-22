import chalk from 'chalk'
import type {
  ColumnSchemaType,
  TableSchemaType,
} from '../../../@types/migrations.types'
import type { EnumSchemaType, PkType } from '../../../@types/model/schema.types'
import { error } from '../../logger'

const defaultType = (value: unknown) => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`
    case 'boolean':
      return `'${+value}'`
    default:
      return value
  }
}

const getSqlType = (field: ColumnSchemaType): string => {
  switch (field.type as ColumnSchemaType['type'] & 'pk') {
    case 'pk':
      return 'CHAR(50) PRIMARY KEY'
    case 'string':
    case 'email': {
      if (field.unique || field.default || field.required) {
        return `VARCHAR(${field.length || 200})`
      }
      return 'TEXT'
    }
    case 'enum': {
      const { values } = field as EnumSchemaType<any>

      const check = `CHECK(${field.key} IN (${values?.map(defaultType)}))`

      if (field.default) {
        return `VARCHAR(${field.length || 200}) ${check}`
      }

      return `TEXT ${check}`
    }

    case 'number':
      return 'INT'
    case 'bool':
      return `CHAR(1) CHECK(${field.key} IN (${[true, false].map(defaultType)}))`
    case 'timestamp':
      return 'TIMESTAMP'
    default:
      error(`"${chalk.magenta(field.type)}" type is not implemented yet!`)
      //   TODO! just for to be seffer side
      return 'TEXT'
  }
}

const generateColumnDefinition = (col: ColumnSchemaType) => {
  const sqls = [`\`${col.key}\``]

  sqls.push(`${getSqlType(col)}`)

  if (col.unique) {
    if ((col.type as PkType['type']) !== 'pk') {
      sqls.push(`UNIQUE`)
    }
  }

  if (col.required) {
    sqls.push('NOT NULL')
  }

  if (col.default) {
    if (typeof col.default !== 'function') {
      if (col.type === 'timestamp' && col.default === 'now') {
        sqls.push(`DEFAULT CURRENT_TIMESTAMP`)
      } else {
        sqls.push(`DEFAULT ${defaultType(col.default)}`)
      }
    }
  }

  return sqls.join(' ')
}

const generateCreateTableSQL = ({ table, columns }: TableSchemaType) => {
  const sqls = [`CREATE TABLE \`${table}\` (`]

  const cols = columns.map((col) => generateColumnDefinition(col))

  sqls.push(cols.join(',\n '))

  sqls.push(');')

  return sqls.join('\n')
}

const generateAlterTableSQL = (
  oldTable: TableSchemaType,
  newTable: TableSchemaType
) => {
  const sqls = [`-- Changes for table \`${newTable.table}\``]

  // Detect new columns
  const newColumns = newTable.columns.filter(
    (newCol) => !oldTable.columns.some((c) => c.key === newCol.key)
  )

  // Detect dropped columns
  const droppedColumns = oldTable.columns.filter(
    (oldCol) => !newTable.columns.some((c) => c.key === oldCol.key)
  )

  // Detect modified columns
  const modifiedColumns = newTable.columns.filter((newCol) => {
    const oldCol = oldTable.columns.find((c) => c.key === newCol.key)
    return oldCol && JSON.stringify(oldCol) !== JSON.stringify(newCol)
  })

  // Generate ALTER TABLE statements
  sqls.push(
    newColumns
      .map((newColumn) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.table}\``,
          'ADD',
          generateColumnDefinition(newColumn),
          ';',
        ].join(' ')
      )
      .join('\n')
  )

  sqls.push(
    droppedColumns
      .map((droppedColumn) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.table}\``,
          'DROP',
          'COLUMN',
          `\`${droppedColumn.key}\`;`,
        ].join(' ')
      )
      .join('\n')
  )

  sqls.push(
    modifiedColumns
      .map((modifiedColumn) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.table}\``,
          'MODIFY',
          'COLUMN',
          generateColumnDefinition(modifiedColumn),
          ';',
        ].join(' ')
      )
      .join('\n')
  )

  return sqls.join('\n')
}

export { generateCreateTableSQL, generateAlterTableSQL }
