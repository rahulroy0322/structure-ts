import { Router } from '../../../../src/structure-ts/router/main';
import { base } from './controllers';

const { routes, route } = Router('base');

route.get('/', base);

export default routes;
