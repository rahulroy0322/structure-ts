import { Router } from '../../../src/structure-ts/router';
import { base, layout, post } from './controllers';

const { routes, route } = Router('test');

route.get('/', base);

route.post('/includes', post, {
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

route.get('/layout', layout);
export default routes;
