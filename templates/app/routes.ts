import { Router } from 'structure-ts';

import { controller } from './controllers';

const { routes, route } = Router();

route.get('/', controller);

export default routes;
