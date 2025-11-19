import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'
import type { ModelType } from '../../../@types/model.types'
import type { MigrationType } from '../../../@types/settings.types'
import { info } from '../../logger'
import { generate } from './generate'

const make = async (
  cwd: string,
  models: ModelType[],
  migrationConfig: Required<MigrationType>,
  migrationName?: string
) => {
  const SQL_DIR = path.relative(
    process.cwd(),
    path.join(process.cwd(), migrationConfig.PATH, 'sql')
  )

  if (!existsSync(SQL_DIR)) {
    await mkdir(SQL_DIR, { recursive: true })
  }

  const migration = await generate(cwd, models, migrationConfig, migrationName)

  if (!migration) {
    info(chalk.magentaBright`nothing to be migrate`)
    process.exit(0)
    return
  }

  info(
    `migrations created for ${chalk.magenta(migration.tables)} table${migration.tables > 1 ? 's' : ''}`
  )

  info(`"${migration.migration}" -> ${chalk.green`created`}`)
  process.exit(0)
}

export { make }
