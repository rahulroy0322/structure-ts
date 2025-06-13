import { processCommand } from './commands';
import { error } from './utils';

const init = () => {
  const args = process.argv;

  if (args.length === 2) {
    args.push('help');
  }
  try {
    return processCommand(args);
  } catch (e) {
    return error((e as Error).message);
  }
};

if (require.main === module) {
  init().finally(() => {
    process.exit(0);
  });
}

export { init };
