import chalk from 'chalk';

export const HELP_MSG = `
  🚀 Atlaskit branch deploy product integrator™ 🚀

  ${chalk.yellow(
    'report-status <result> <url>',
  )} Reports the status of the current build


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

export class ReportStatusValidationError extends Error {}

export async function reportStatus() {}
