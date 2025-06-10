import { mock } from 'node:test';

import { Router } from '../../../../src/structure-ts/router/main';

const { routes, route } = Router();

route.get('/', mock.fn());
route.post('/', mock.fn());

export default routes;
