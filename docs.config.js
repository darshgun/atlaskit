// @flow
let MultiEntrypointAliases;

try {
  // eslint-disable-next-line
  MultiEntrypointAliases = require('./services/website-constellation/aliases-written-map.json');
} catch (e) {
  throw new Error(
    'ERROR - Local aliases have not been written. Please write aliases before continuing by running `yarn constellation:aliases`',
  );
}

const docs = [
  {
    path: './docs',
    name: 'Docs',
    description:
      'Information about atlaskit as a whole, and contributing to atlaskit',
  },
];

module.exports = () => ({
  siteName: 'Atlaskit',
  packages: ['./packages/core/radio'],
  docs,
  babelConfig: './services/website-constellation/babel.config.js',
  gatsbyNode: {
    onCreateWebpackConfig: ({ actions, loaders, getConfig }) => {
      actions.setWebpackConfig({
        resolve: {
          mainFields: ['atlaskit:src', 'module', 'browser', 'main'],
          extensions: ['.js', '.ts', '.tsx'],
          alias: MultiEntrypointAliases,
        },
      });
      const config = getConfig();

      config.module.rules = [
        // Omit the default rule where test === '\.jsx?$'
        ...config.module.rules.filter(
          rule => String(rule.test) !== String(/\.jsx?$/),
        ),
        // Recreate it with custom exclude filter
        {
          ...loaders.js(),
          test: /\.jsx?$/,
          exclude: modulePath =>
            /node_modules/.test(modulePath) &&
            /*
              What this regex is saying is:
              Do not exclude:
                - files in node_modules
                - that are in a @brisk-docs scoped package
                - BUT still exclude things in the node_modules of that package
            */
            !/node_modules\/@brisk-docs\/[^/]+\/(?!node_modules)/.test(
              modulePath,
            ),
        },
      ];
      actions.replaceWebpackConfig(config);
    },
  },
});
