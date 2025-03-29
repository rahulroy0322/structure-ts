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

export { base };
