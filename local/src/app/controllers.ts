import type { ControllerType } from '../../../src/@types';
import { ok } from '../../../src/main';

const index: ControllerType = (question, reply) => {
  /*   reply.status(ok()).json({
      success: true,
      data: {
        message: 'index route is working!',
      },
    }); */
  reply.render('app/index', {
    index: 'index route is working!',
  });
};

const int: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'int route is working!',
    },
  });
};

const str: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'str route is working!',
    },
  });
};

const bool: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'bool route is working!',
    },
  });
};

const catchAll: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'catch all route is working!',
    },
  });
};

const post: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'post route is working!',
    },
  });
};

export { index, post, str, int, bool, catchAll };
