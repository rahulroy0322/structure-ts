import { error } from '../utils';
import { create } from './create/main';
import { showHelp } from './help';

const commands = {
  create,
  help: showHelp,
};

const cwd = process.cwd();

const processCommand = async (args: string[]) => {
  const options = args.slice(3);

  const command = args[2] as keyof typeof commands;

  if (!(command in commands)) {
    error(`unknown command "${command}"`);
  }

  await commands[command]?.(options, cwd);
};

export { processCommand };
export * from './help';
