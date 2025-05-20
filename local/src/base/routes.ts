import { Router } from '../../../src/structure-ts/router';
import { base, post } from './controllers';

const { routes, route } = Router('test');

route.get('/', base);

route.post('/tt', post, {
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
});

export default routes;
