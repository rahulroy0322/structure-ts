import { Router } from 'stratus-ts'

import { controller } from './controllers'

const { routes, route } = Router()

route.get('/', controller)

export default routes
