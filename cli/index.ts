#! /usr/bin/env node
import { init } from './main'

init().finally(() => {
  process.exit(0)
})
