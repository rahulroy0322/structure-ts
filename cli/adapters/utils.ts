import { error } from '../commands/logger'

const todo = () => {
  // TODO! proper error!
  error('todo!')
  process.exit(1)
}

export { todo }
