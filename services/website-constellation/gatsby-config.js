// @flow
const fs = require('fs-extra');
const path = require('path');

const constellationInitialPackages = require('./constellation-package-list');

module.exports = {
  plugins: [
    {
      resolve: '@manypkg/gatsby-source-workspace',
      options: {
        workspaceFilter: ws => constellationInitialPackages.includes(ws.name),
        /*
          BC - I have defined the extra fields here that we think will be useful. This should not
          be considered a canon list of etra fields and we should be happy to both add, remove or modify
          these as the data actually demands.
        */
        extraFields: [
          {
            name: 'maintainers',
            definition: `[String]`,
          },
          {
            name: 'description',
            definition: `String`,
          },
          {
            name: 'docsList',
            definition: `[String]`,
            getFieldInfo: async ws => {
              const docsPath = path.join(ws.dir, 'docs');
              if (!(await fs.pathExists(docsPath))) {
                return [];
              }

              const docs = await fs.readdir(docsPath);
              return docs;
            },
          },
          {
            name: 'examplesList',
            definition: `[String]`,
            getFieldInfo: async ws => {
              const examplesPath = path.join(ws.dir, 'examples');
              if (!(await fs.pathExists(examplesPath))) {
                return [];
              }

              const examples = await fs.readdir(examplesPath);
              return examples;
            },
          },
          {
            name: 'rawChangelog',
            definition: `String`,
            getFieldInfo: async ws => {
              const changelogPath = path.join(ws.dir, 'CHANGELOG.md');
              if (!(await fs.pathExists(changelogPath))) {
                return '';
              }

              return fs.readFile(changelogPath, 'utf-8');
            },
          },
          {
            name: 'changelogEntries',
            // Note that the `gatsby-node` of our app is responsible for adding the `ChangelogEntry` type
            // This isn't a floating thing from nowhere.
            definition: `[ChangelogEntry] @link(by: "packageName")`,
            getFieldInfo: async ws => {
              return ws.name;
              // const changelogPath = path.join(ws.dir, 'CHANGELOG.md');
              // if (!(await fs.pathExists(changelogPath))) {
              //   return '';
              // }
              // const changelog = await fs.readFile(changelogPath, 'utf-8');
              // const thingy = divideChangelog(changelog).map(c => ({
              //   ...c,
              //   packageName: ws.name,
              // }));
              // return thingy;
            },
          },
        ],
      },
    },
    // {
    //   resolve: require.resolve('@brisk-docs/gatsby-plugin'),
    // },
  ],
};
