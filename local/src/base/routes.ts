import { Router } from '../../../src/structure-ts/router';
import {base } from './controllers';

const { routes, route } = Router('test');

route.get('/', base);

export default routes;
