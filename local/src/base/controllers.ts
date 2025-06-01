import type { ControllerType } from '../../../src/@types';
import { ok } from '../../../src/main';
import { User } from './model';

const base: ControllerType = async (question, reply) => {
  const users = await User.fetch.all();

  reply.status(ok()).json({
    success: true,
    data: {
      message: 'base route is working!',
      users,
    },
  });
};

const post: ControllerType = async (question, reply) => {
  const { body } = await question.body<{
    email: string;
    name: string;
    work?: string;
  }>();

  if (!body.work) {
    body.work = undefined;
  }

  reply.status(ok()).render('base/post', body);
};

const layout: ControllerType = (_question, reply) => {
  reply.status(ok()).render('base/layout');
};

export { base, post, layout };
