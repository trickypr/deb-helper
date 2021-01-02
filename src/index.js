const yargs = require('yargs')
const search = require('./search')

yargs.scriptName('deb')

yargs.command(
  'search <query>',
  'Search for a package',
  (yargs) => {
    yargs.positional('query', {
      type: 'string',
      describe: 'What you want to search for',
    })
  },
  async (argv) => {
    console.log(await search(argv.query))
  }
)

yargs.help().argv
