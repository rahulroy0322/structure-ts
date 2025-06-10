import { ControllerType } from '../../../../src/@types';

const base: ControllerType = (question, reply) => {
  reply.json({
    success: true,
    data: {
      message: 'base route is working!',
    },
  });
};

export { base };
