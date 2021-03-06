// @flow
const chalk = require('chalk');

// eslint-disable-next-line no-unused-expressions
chalk.bgRedBright;

function printHowToReadStats() {
  const vl = chalk.gray('|');
  const hl = chalk.gray('└─');
  console.log(
    chalk.dim(
      `${chalk.yellow(
        'Note: This below is an example of how to interpret output of measure tool\n',
      )}
       ${chalk.yellow('– main:')} ${chalk.green('2.17 MB')} (${chalk.red(
        '574 kB',
      )})   [>1%]   ${chalk.red('+90.78 kB')} (${chalk.red('+24.5 kB')})
      ${vl}     ${vl}        ${vl}          ${vl}       ${vl}          ${hl} diff in source code size after gzip
      ${vl}     ${vl}        ${vl}          ${vl}       ${hl} diff in source code size
      ${vl}     ${vl}        ${vl}          ${hl} indicates that bundle size increased beyond a threshold
      ${vl}     ${vl}        ${hl} source code size gzip
      ${vl}     ${hl} source code size
      ${hl} name of a split, can be main or async
`,
    ),
  );
}

module.exports = { printHowToReadStats };
