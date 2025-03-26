import { Router } from '../../../src/structure-ts/router';
import { index, str, int, bool, catchAll, post } from './controllers';

const { routes, route } = Router();

route.get('/', index);
route.get('/<a:str>', str);
route.get('/<a:int>', int);
route.get('/<a:bool>', bool);
route.get('/<a:*>', catchAll);
route.post('/', post);

export default routes;
