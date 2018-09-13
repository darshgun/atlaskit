const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const globby = require('globby');
const reactIntlPot = require('babel-plugin-react-intl-pot');

async function extractCommand(absPathToPackage, searchDir) {
  const dirToSearch = path.join(absPathToPackage, searchDir);
  const jsFiles = globby
    .sync(['**/*.js'], { cwd: dirToSearch })
    .map(file => path.join(dirToSearch, file));
  console.log(`Found ${jsFiles.length} files in ${searchDir} directory...`);

  const extractionPromises = jsFiles.map(extractMessagesFromFile);
  const allMessagesFromFiles = await Promise.all(extractionPromises);
  const messages = allMessagesFromFiles.reduce(
    (allMessages, nextMessages) => [...allMessages, ...nextMessages],
    [],
  );
  // Search for duplicate messageIds
  const duplicateMessageIds = messages
    .map(m => m.id)
    .filter((id, idx, arr) => arr.indexOf(id) !== idx);
  if (duplicateMessageIds.length !== 0) {
    console.error('Error: duplicate messageIds found', duplicateMessageIds);
    process.exit(1);
  }

  console.log(`Found ${messages.length} messages...`);

  const potString = reactIntlPot.msg2pot(messages);
  const outputFilePath = path.join(absPathToPackage, 'translations.pot');
  fs.writeFileSync(outputFilePath, potString);
  console.log('Written to ', outputFilePath);
}

function extractMessagesFromFile(file) {
  return new Promise((resolve, reject) => {
    const babelConfig = { plugins: ['react-intl'] };
    babel.transformFile(file, babelConfig, (err, res) => {
      if (err) reject(err);
      else resolve(res.metadata['react-intl'].messages);
    });
  });
}

module.exports = extractCommand;
