import { Router } from '../../../src/structure-ts/router';
import { bool, catchAll, cookie, index, int, post, str } from './controllers';

const { routes, route } = Router();

route.get('/', index);
route.get('/cookie', cookie);
route.get('/<a:str>', str);
route.get('/<a:int>', int);
route.get('/<a:bool>', bool);
route.get('/<a:*>', catchAll);
route.post('/', post);

export default routes;
