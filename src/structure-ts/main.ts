import type {
  HandlerReturnType,
  QuestionType,
  ReplyType,
  ServerOptionsType,
} from '../@types'
import { checkApps } from './app/main'
import { handler } from './handler'
import { getServerInstance } from './instance'
import { Handler } from './router/handler'
import { BASE_DIR, loadSettings, SETTINGS } from './settings/main'

const StructureImpl = (
  options: ServerOptionsType = {
    keepAlive: false,
  },
  {
    port,
    templateDir,
    handel,
  }: {
    port: number
    handel: (
      // eslint-disable-next-line no-unused-vars
      qestion: QuestionType,
      // eslint-disable-next-line no-unused-vars
      reply: ReplyType<unknown>
    ) => Promise<HandlerReturnType>

    templateDir: string
  }
) => {
  if (!SETTINGS) {
    console.error(`some thingwent wrong...`, 'StructureImpl')

    process.exit(1)
  }

  let isListening = false

  const server = getServerInstance(
    options,
    handler(handel, {
      templateDir,
      errorController: SETTINGS.ERROR_CONTROLLER as any,
      notFoundController: SETTINGS.NOT_FOUND_CONTROLLER as any,

      // TODO! remove this
      baseDir: BASE_DIR,
    })
  )

  const close = () => {
    server.close()
  }

  const listen = (cb?: (port: number) => void) => {
    if (isListening) {
      console.error('App is Already listening')
      return {
        close,
      }
    }

    isListening = true
    server.listen(port)
    cb?.(port)
    return {
      close,
    }
  }

  return {
    listen,
  }
}

const Structure = async (options: ServerOptionsType) => {
  const { PORT } = await loadSettings()

  const port = PORT

  const routes = await checkApps()

  const { handel } = Handler(routes)

  return StructureImpl(options, {
    port,
    templateDir: '',
    handel,
  })
}

export { Structure }

export * from './router/main'
export * from './status/main'

export default Structure
