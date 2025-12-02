import { Router } from '../../../src/main'
import { other } from './controllers'

const { routes, route } = Router('/other')

route.get('/', other)

export default routes
