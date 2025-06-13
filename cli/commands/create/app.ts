import { existsSync } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import { error, logExit } from '../../utils';
import { write } from './operations';

const createApp = async (cwd: string, path: string) => {
  if (!existsSync(relative(cwd, join(cwd, 'src/settings.ts')))) {
    return error('Please Create a project first');
  }

  const appRoot = join(cwd, 'src', path);

  if (existsSync(appRoot)) {
    return error('App already exists with this name');
  }

  console.log(`Scaffolding app in ${relative(cwd, appRoot)}...`);

  const templateDir = resolve(
    __dirname, // fileURLToPath(import.meta.url),
    '../../..',
    'templates/app'
  );

  await mkdir(appRoot, { recursive: true });
  const files = await readdir(templateDir);

  for (const file of files) {
    await write(appRoot, templateDir, file);
  }
  console.log(`App created succesfully...`);

  let msg = `Done. Now add "${path}" to the app list in settings`;

  if (process.env.PNPM_HOME) {
    msg += '\n  pnpm dev';
  } else {
    msg += `\n  npm run dev`;
  }
  return logExit(msg);
};

export { createApp };
