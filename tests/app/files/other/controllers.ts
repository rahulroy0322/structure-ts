import { ControllerType } from '../../../../src/@types';

const other: ControllerType = (question, reply) => {
  reply.json({
    success: true,
    data: {
      message: 'other route is working!',
    },
  });
};

export { other };
