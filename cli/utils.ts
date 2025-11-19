const error = (msg: string) => {
  console.error(msg)
  process.exit(1)
}
const logExit = (msg?: unknown) => {
  if (msg) {
    console.log(msg)
  }
  process.exit(0)
}

export { error, logExit }
