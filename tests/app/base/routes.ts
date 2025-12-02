import { Router } from '../../../src/main'
import { base } from './controllers'

const { routes, route } = Router('base')

route.get('/', base)

export default routes
