import { parse } from 'node:url'

const parsePath = (path: string) => parse(path)

export { parsePath }
