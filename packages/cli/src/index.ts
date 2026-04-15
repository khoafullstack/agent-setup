import { Command } from 'commander'
import { helloCommand } from './commands/hello.js'

const program = new Command()

program
  .name('opencode-setup')
  .description('OpenCode Setup CLI')
  .version('1.0.0')

program
  .command('hello')
  .description('Print Hello World')
  .action(helloCommand)

program.parse()
