import type { ControllerType } from '../../@types'
import { notFound } from '../status/main'

const notFoundController: ControllerType = (question, reply) => {
  const route = question.path()
  reply.status(notFound()).json({
    success: false,
    route,
    error: {
      name: 'NOT Found!',
      message: `the route "${route}" does not found!`,
    },
  })
}

export { notFoundController }
