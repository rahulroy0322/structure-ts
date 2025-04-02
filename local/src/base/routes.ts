import { ok } from '../../../src/structure-ts';
import { Router } from '../../../src/structure-ts/router';
import { base } from './controllers';

const { routes, route } = Router('test');

route.get('/', base);

route.post(
  '/tt',
  (_, reply) => {
    reply.status(ok()).json({
      success: true,
      data: {
        message: 'success',
      },
    });
  },
  {
    body: {
      email: {
        type: 'email',
        required: true,
      },
      name: {
        type: 'string',
        required: true,
      },
      work: {
        type: 'string',
      },
    },
  }
);

export default routes;
