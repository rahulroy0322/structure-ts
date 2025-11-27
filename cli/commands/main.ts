import { error } from '../utils'
import { create } from './create/main'
import { migrate } from './db/migrate/main'
import { migration } from './db/migrations/main'
import { showHelp } from './help'
import { version } from './version'

const commands = {
  create,
  help: showHelp,
  '--version': version,
  '-v': version,
  version,
  'db:migration': migration,
  'db:migrate': migrate,
}

const cwd = process.cwd()

const processCommand = async (args: string[]) => {
  const options = args.slice(3)

  const command = args[2] as keyof typeof commands

  if (!(command in commands)) {
    error(`unknown command "${command}"`)
  }

  await commands[command]?.(options, cwd)
}

export { processCommand }
export * from './help'
