import pkg from '../../package.json'

const version = () => {
  console.log(`${pkg.version}`)
}

export { version }
