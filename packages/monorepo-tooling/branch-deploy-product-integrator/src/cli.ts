import chalk from 'chalk';
import meow from 'meow';
import { ValidationError, ErrorType, Command } from './types';
import * as push from './commands/push';
import * as reportStatus from './commands/reportStatus';

// prettier-ignore
const HELP_MSG = `
  🚀 Atlaskit branch deploy product integrator™ 🚀

  ${chalk.green('Commands')}

  ${chalk.yellow.bold('push')}            Installs an atlaskit branch deploy and pushes it to a product repo
  ${chalk.yellow.bold('report-status')}   Posts the result of a product CI build back to its originating atlaskit PR
  ${chalk.yellow.bold('help')}            Show help information for a command


  ${chalk.green('Global options')}
    ${chalk.yellow('--dryRun')}     Performs a dry run, does not perform actual git commands or fetch requests
`;

class CliValidationError extends Error implements ValidationError {
  type: ErrorType = 'cli';
}

type CommandImpl = {
  run: (inputs: string[], flags: {}) => void;
  helpMsg: string;
};

const commandMap: Record<Command, CommandImpl> = {
  push: {
    run: (inputs: string[], flags: {}) =>
      push.push(inputs[0], inputs[1], flags, inputs.slice(2)),
    helpMsg: push.HELP_MSG,
  },
  'report-status': {
    run: () => reportStatus.reportStatus(),
    helpMsg: reportStatus.HELP_MSG,
  },
};

export function run() {
  const cli = meow(HELP_MSG, {
    autoHelp: false,
    flags: {
      branchPrefix: {
        type: 'string',
      },
      atlaskitBranchName: {
        type: 'string',
      },
      packageEngine: {
        type: 'string',
      },
      atlaskitCommitHash: {
        type: 'string',
      },
      packages: {
        type: 'string',
      },
      dedupe: {
        type: 'boolean',
      },
      cmd: {
        type: 'string',
      },
      dryRun: {
        type: 'boolean',
      },
      productCiPlanUrl: {
        type: 'string',
      },
    },
  });

  let [command, ...inputs] = cli.input;

  if (command === 'help') {
    cli.flags.help = true;
    command = inputs[0];
  }

  try {
    if (command == null) {
      // This exits with non-zero exit status
      cli.showHelp();
      return;
    }

    if (!Object.keys(commandMap).includes(command)) {
      throw new CliValidationError('Invalid command');
    }

    let commandImpl = commandMap[command as Command];
    if (cli.flags.help) {
      console.log(commandImpl.helpMsg);
      process.exit(1);
    }
    return commandImpl.run(inputs, cli.flags);
  } catch (e) {
    if (e.type === 'cli') {
      console.error(chalk.red(e.message));
      cli.showHelp(2);
    } else if (Object.keys(commandMap).includes(e.type)) {
      const commandImpl = commandMap[e.type as Command];
      console.error(chalk.red(e.message));
      console.log(commandImpl.helpMsg);
      process.exit(2);
    }

    console.error(chalk.red(e));
    process.exit(1);
  }
}
