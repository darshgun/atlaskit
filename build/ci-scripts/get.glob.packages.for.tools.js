// @flow

const {
  getPackagesInfo,
  TOOL_NAME_TO_FILTERS,
} = require('@atlaskit/build-utils/tools');

async function main(toolNames, opts = {}) {
  const { cwd = process.cwd() } = opts;

  if (!toolNames.length) {
    console.error(
      `Please pass one or more tool names (${Object.keys(
        TOOL_NAME_TO_FILTERS,
      ).join(', ')})`,
    );
    throw Error();
  }

  const filters = toolNames.map(toolName => {
    const filterFn = TOOL_NAME_TO_FILTERS[toolName];

    if (!filterFn) {
      console.error(
        `Invalid tool name: "${toolName}" (${Object.keys(
          TOOL_NAME_TO_FILTERS,
        ).join(', ')})`,
      );
      throw Error();
    }

    return filterFn;
  });

  const packages = await getPackagesInfo(cwd);
  const relativePaths = packages
    .filter(pkg => filters.every(filter => filter(pkg)))
    .map(pkg => pkg.relativeDir);

  return relativePaths.length > 1
    ? `{${relativePaths.join()}}`
    : relativePaths[0];
}

if (require.main === module) {
  const toolNames = process.argv.slice(2);
  main(toolNames)
    .then(glob => {
      console.log(glob);
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = main;
