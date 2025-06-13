import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const copyDir = async (srcDir: string, destDir: string) => {
  await mkdir(destDir, { recursive: true });
  const files = await readdir(srcDir);
  for (const file of files) {
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, file);
    await copy(srcFile, destFile);
  }
};

const copy = async (src: string, dest: string) => {
  if ((await stat(src)).isDirectory()) {
    await copyDir(src, dest);
  } else {
    await copyFile(src, dest);
  }
};

const write = async (
  root: string,
  templateDir: string,
  file: string,
  content?: string
) => {
  const targetPath = join(root, file);
  if (content) {
    await writeFile(targetPath, content);
  } else {
    await copy(join(templateDir, file), targetPath);
  }
};

export { write };
