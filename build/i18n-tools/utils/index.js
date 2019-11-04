// @flow
const chalk = require('chalk');
const babel = require('@babel/core');
const { promisify } = require('util');

const babelConfig = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    'react-intl',
    '@babel/syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-syntax-optional-catch-binding',
  ],
};

function errorAndExit(msg /*: string */) {
  console.error(chalk.red(msg));
  process.exit(1);
}

function isTypeScript(type /*: string */) {
  const lowerCasedType = String(type).toLowerCase();
  return lowerCasedType === 'typescript' || lowerCasedType === 'ts';
}

function getExtensionForType(type /*: string */) {
  return isTypeScript(type) ? '.ts' : '.js';
}

async function extractMessagesFromFile(file /*: string */) {
  const res = await promisify(babel.transformFile)(file, babelConfig);
  return res.metadata['react-intl'].messages;
}

module.exports = {
  errorAndExit,
  getExtensionForType,
  extractMessagesFromFile,
  isTypeScript,
};
