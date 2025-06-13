import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { basename, join, relative, resolve } from 'node:path';

import PKG from '../../../package.json';
import { error, logExit } from '../../utils';
import { write } from './operations';

const isValidPackageName = (projectName: string) => {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
};

const createProject = async (cwd: string, path: string) => {
  if (existsSync(path)) {
    return error('Project already exists with this name');
  }

  const root = relative(cwd, join(cwd, path));

  const templateDir = resolve(
    __dirname, // fileURLToPath(import.meta.url),
    '../../..',
    'templates/project'
  );

  const packageName = basename(resolve(path));

  if (!isValidPackageName(packageName)) {
    throw new Error(`Invalid project name "${packageName}"`);
  }

  await mkdir(root, { recursive: true });

  //   prompts.log.step(`Scaffolding project in ${root}...`)
  console.log(`Scaffolding project in ${root}...`);

  if (!existsSync(templateDir)) {
    return error('somthing wet wrong!');
  }

  const files = await readdir(templateDir);

  for (const file of files.filter((f) => f !== 'package.json')) {
    await write(root, templateDir, file);
  }
  console.log(`Project created succesfully...`);

  console.log('Package json creating...');
  const pkg = JSON.parse(
    await readFile(join(templateDir, `package.json`), 'utf-8')
  );

  pkg.name = packageName;
  pkg.dependencies = pkg.dependencies ?? {};
  pkg.dependencies['structure-ts'] = `^${PKG.version}`;

  await write(
    root,
    templateDir,
    'package.json',
    JSON.stringify(pkg, null, 2) + '\n'
  );
  console.log(`Package json created succesfully...`);

  let doneMessage = '';
  const cdProjectName = relative(cwd, root);
  doneMessage += `Done. Now run:`;
  if (root !== cwd) {
    doneMessage += `\n  cd ${
      cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
    }`;
  }
  if (process.env.PNPM_HOME) {
    doneMessage += '\n  pnpm i';
    doneMessage += '\n  pnpm dev';
  } else {
    doneMessage += `\n  npm install`;
    doneMessage += `\n  npm run dev`;
  }
  return logExit(doneMessage);
};

export { createProject };
