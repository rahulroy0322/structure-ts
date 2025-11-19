import pkg from '../../package.json'

const showHelp = () => {
  console.log(
    `<Structure-Ts> : ${pkg.version}
📋 Structure-Ts - Available Commands:
        
    help                          Show help message
    create project|app <name>     Create a project / app
    db:migration <name?>          Create Migrations

💡 Examples:
  st/structure-ts create project first-project #creates ne project called first-project
  st/structure-ts create app home #creates new app called home
`
  )
}

export { showHelp }
