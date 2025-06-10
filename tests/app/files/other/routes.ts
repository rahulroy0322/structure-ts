import { Router } from '../../../../src/structure-ts/router/main';
import { other } from './controllers';

const { routes, route } = Router('/other');

route.get('/', other);

export default routes;
