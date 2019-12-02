// @flow
const docs = [
  {
    path: '../../docs',
    urlPath: 'docs',
    name: 'Docs',
    description:
      'Information about atlaskit as a whole, and contributing to atlaskit',
  },
];

module.exports = () => ({
  siteName: 'Atlaskit',
  packages: ['../../packages/core/radio'],
  docs,
  babelConfig: './babel.config.js',
});
