import { Stratus } from 'stratus-ts'

const main = async () => {
  const app = await Stratus({})

  const { close } = app.listen((port) => {
    console.log(`server running on port : ${port}`)
  })

  process.on('SIGINT', close).on('SIGTERM', close)
}

export default main
