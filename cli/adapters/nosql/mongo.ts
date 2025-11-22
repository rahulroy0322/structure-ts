import chalk from 'chalk'
import type { MongoConfigType } from '../../@types/db.config.types'
import type { DatabaseAdapterType } from '../../@types/migration/db.types'
import { error } from '../../commands/logger'

const MongoAdapter = (
  _config: Omit<MongoConfigType, 'engine'>
): DatabaseAdapterType => {
  error(`mongo is a nosql db so dont need to be ${chalk.cyanBright`migrate`}`)
  process.exit(1)
}

export { MongoAdapter }
