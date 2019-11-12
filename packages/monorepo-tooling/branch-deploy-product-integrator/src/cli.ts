import chalk from 'chalk';
import meow from 'meow';
import {
  push,
  PushValidationError,
  HELP_MSG as PUSH_HELP_MSG,
} from './commands/push';
import {
  reportStatus,
  ReportStatusValidationError,
  HELP_MSG as REPORT_STATUS_HELP_MSG,
} from './commands/reportStatus';

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

class ValidationError extends Error {}

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
    if (command === 'push') {
      if (cli.flags.help) {
        console.log(PUSH_HELP_MSG);
        process.exit(1);
      }
      return push(inputs[0], inputs[1], cli.flags, inputs.slice(2));
    } else if (command === 'report-status') {
      if (cli.flags.help) {
        console.log(REPORT_STATUS_HELP_MSG);
        process.exit(1);
      }
      return reportStatus();
    } else if (command == null) {
      cli.showHelp();
    } else {
      throw new ValidationError('Invalid command');
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      console.error(chalk.red(e.message));
      cli.showHelp(2);
    } else if (e instanceof PushValidationError) {
      console.error(chalk.red(e.message));
      console.log(PUSH_HELP_MSG);
      process.exit(2);
    } else if (e instanceof ReportStatusValidationError) {
      console.error(chalk.red(e.message));
      console.log(REPORT_STATUS_HELP_MSG);
      process.exit(2);
    }

    console.error(chalk.red(e));
    process.exit(1);
  }
}
