import type { ControllerType } from '../../../src/main'

const other: ControllerType = (_question, reply) => {
  reply.json({
    success: true,
    data: {
      message: 'other route is working!',
    },
  })
}

export { other }
