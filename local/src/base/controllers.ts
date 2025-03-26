import type { ControllerType } from '../../../src/@types';
import { ok } from '../../../src/main';

const base: ControllerType = (question, reply) => {

  reply.status(ok()).json({
    success: true,
    data: {
      message: 'base route is working!',
    },
  });
};

export { base };
