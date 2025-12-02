import type { ControllerType } from '../../../src/main'

const base: ControllerType = (_question, reply) => {
  reply.json({
    success: true,
    data: {
      message: 'base route is working!',
    },
  })
}

export { base }
