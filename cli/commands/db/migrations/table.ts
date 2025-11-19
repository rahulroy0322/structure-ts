import chalk from 'chalk'
import type {
  ColumnSchemaType,
  TableSchemaType,
} from '../../../@types/migrations.types'
import type { EnumSchemaType } from '../../../@types/model/schema.types'
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
    case 'string':
    case 'email':
      return 'TEXT'
    case 'enum': {
      const { values } = field as EnumSchemaType<any>

      return `TEXT CHECK(status IN (${values?.map(defaultType)}))`
    }

    case 'number':
      return 'INT'
    case 'bool':
      return `CHAR(1) CHECK(status IN (${[true, false].map(defaultType)}))`
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

  if (col.required) {
    sqls.push('NOT NULL')
  }
  if (col.default) {
    if (typeof col.default !== 'function') {
      sqls.push(`DEFAULT ${defaultType(col.default)}`)
    }
  }
  return sqls.join(' ')
}

const generateCreateTableSQL = ({
  table,
  columns,
  indexes,
}: TableSchemaType) => {
  const sqls = [`CREATE TABLE \`${table}\` (`]

  const cols = columns.map((col) => generateColumnDefinition(col))

  const _indexes = indexes.map((index) =>
    [
      'CONSTRAINT',
      `\`${index.name}\``,
      index.pk ? 'PRIMARY KEY' : index.unique ? 'UNIQUE' : 'INDEX',
      `(\`${index.key}\`)`,
    ].join(' ')
  )

  sqls.push([...cols, ..._indexes].join(',\n '))

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
          'COLUMN',
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

  // Generate ALTER TABLE statements for new indexs
  const newIndexs = newTable.indexes.filter(
    (i) => !oldTable.indexes.find((ind) => ind.key === i.key)
  )

  sqls.push(
    newIndexs
      .map((newIndex) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.table}\``,
          'ADD',
          'CONSTRAINT',
          `\`${newIndex.name}\``,
          newIndex.pk ? 'PRIMARY KEY' : newIndex.unique ? 'UNIQUE' : 'INDEX',
          `(\`${newIndex.key}\`);`,
        ].join(' ')
      )
      .join('\n')
  )

  // Generate ALTER TABLE statements for droped indexs
  const droppedIndexs = oldTable.indexes.filter(
    (i) => !newTable.indexes.find((ind) => ind.key === i.key)
  )

  sqls.push(
    droppedIndexs
      .map((dIndex) =>
        [
          'ALTER',
          'TABLE',
          `\`${newTable.table}\``,
          'DROP',
          'CONSTRAINT',
          `\`${dIndex.name}\`;`,
        ].join(' ')
      )
      .join('\n')
  )

  // todo Generate ALTER TABLE statements for modified indexs

  const modifiedIndexs = newTable.indexes.filter((newIndex) => {
    const oldIndex = oldTable.indexes.find((i) => i.key === newIndex.key)

    if (!oldIndex) {
      return false
    }

    return newIndex.pk !== oldIndex.pk || newIndex.unique !== oldIndex.unique
  })

  sqls.push(
    modifiedIndexs
      .map((index) =>
        [
          [
            'ALTER',
            'TABLE',
            `\`${newTable.table}\``,
            'DROP',
            'CONSTRAINT',
            `\`${index.name}\`;`,
          ].join(' '),
          [
            'ALTER',
            'TABLE',
            `\`${newTable.table}\``,
            'ADD',
            'CONSTRAINT',
            `\`${index.name}\``,
            index.pk ? 'PRIMARY KEY' : index.unique ? 'UNIQUE' : 'INDEX',
            `(\`${index.key}\`);`,
          ].join(' '),
          '--> statement-breakpoint',
        ].join('\n')
      )
      .join('\n')
  )

  return sqls.join('\n')
}

export { generateCreateTableSQL, generateAlterTableSQL }
