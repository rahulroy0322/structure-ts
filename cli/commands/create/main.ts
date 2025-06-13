import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

import { error } from '../../utils';
import { createApp } from './app';
import { createProject } from './project';

const rl = readline.createInterface({ input, output });

const create = async (commands: string[], cwd: string) => {
  if (!commands.length) {
    return error('"create" command neads a param to to create');
  }

  if (commands.at(0) === 'project') {
    let name = commands[1];
    if (!name) {
      const answer = await rl.question('What is the project name :>');

      if (!answer) {
        return error('Please provide name to create project');
      }
      name = answer;
    }
    return createProject(cwd, name);
  }

  if (commands.at(0) === 'app') {
    let name = commands[1];
    if (!name) {
      const answer = await rl.question('What is the app name :>');

      if (!answer) {
        return error('Please provide name to create app');
      }
      name = answer;
    }
    return createApp(cwd, name);
  }

  return error('this should not be called');
};

export { create };
