import chalk from 'chalk';
import { ValidationError, ErrorType } from '../types';

export const HELP_MSG = `
  🚀 Atlaskit branch deploy product integrator™ 🚀

  ${chalk.yellow(
    'report-status <result> <url>',
  )} Reports the status of the current build

  ${chalk.red('This command is not implemented yet')}

   ${chalk.green('Options')}
     ${chalk.yellow(
       '--dryRun',
     )} Log out commands that would be run instead of running them

  ${chalk.green('Environment Variables')}
    ${chalk.yellow(
      'ATLASKIT_CI_USERNAME',
    )} Username to authenticate atlaskit CI API requests with
    ${chalk.yellow(
      'ATLASKIT_CI_PASSWORD',
    )} Password to authenticate atlaskit CI API requests with

  ${chalk.green('Examples')}
    ${chalk.yellow(
      'report-status success https://bamboo.atlassian.com/some-build-result',
    )}
`;

export class ReportStatusValidationError extends Error
  implements ValidationError {
  type: ErrorType = 'report-status';
}

export async function reportStatus() {
  console.log('Not implemented');
}
