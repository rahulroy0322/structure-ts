import { type ControllerType, ok } from 'structure-ts'

const controller: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'working',
    },
  })
}

export { controller }
