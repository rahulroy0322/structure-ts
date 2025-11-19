import type { StateType } from '../../../@types/migrations.types'
import { generateAlterTableSQL, generateCreateTableSQL } from './table'

const getSql = (currentState: StateType, newState: StateType) => {
  const sqls = [`-- Migration start '${newState.at}'`]

  // Detect new tables
  const newTables = newState.tables.filter(
    (newTable) => !currentState.tables.some((t) => t.table === newTable.table)
  )

  //   Detect dropped tables
  const droppedTables = currentState.tables.filter(
    (oldTable) => !newState.tables.some((t) => t.table === oldTable.table)
  )

  // Generate SQL for new tables
  newTables.map((table, index) => {
    sqls.push(generateCreateTableSQL(table))
    // eslint-disable-next-line no-magic-numbers
    if (index !== newTables.length - 1) {
      sqls.push('--> statement-breakpoint')
    }
  })

  sqls.push('--> statement-breakpoint')
  // Generate SQL for dropped tables
  droppedTables.map((table) => {
    sqls.push(`DROP TABLE IF EXISTS \`${table.table}\`;`)
    sqls.push('\n')
  })
  sqls.push('--> statement-breakpoint')

  // Detect altered tables (simplified)
  newState.tables.map((newTable) => {
    const oldTable = currentState.tables.find((t) => t.table === newTable.table)
    if (oldTable) {
      sqls.push(generateAlterTableSQL(oldTable, newTable))
    }
  })
  sqls.push('--> statement-breakpoint')

  sqls.push(`-- Migration end '${newState.at}'`)
  return sqls.join('\n')
}

export { getSql }
