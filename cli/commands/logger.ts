import chalk from 'chalk'

const error = (msg: string) => console.error(chalk.redBright(msg))

const info = (msg: string) => console.info(chalk.cyanBright(msg))

export { error, info }
