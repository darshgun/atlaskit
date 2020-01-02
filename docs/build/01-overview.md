# Build Overview

Atlassian Frontend uses bitbucket pipelines for its Continuous Integration (CI) needs to run builds and release packages.

## Developer workflow

This outlines the basic dev workflow from a build perspective.

1. Make development changes locally to a package, commit and push
2. A default build is triggered for your branch that builds, lints, typechecks and runs tests for all relevant packages
3. Product integration builds are triggered for your branch, see [Product Integration](product-integration) for more details.
4. Raise a PR with your changes targetting `develop`, unless you have a reason to target `master`, see [Release workflow](release-workflow)
5. Land your PR after it has gained approvals and the default pipeline builds are green

## Tooling

The following outlines all relevant tooling used in the atlassian frontend repo:

### Monorepo management

- [Bolt](https://github.com/boltpkg/bolt/) - A package management CLI built on top of [Yarn](https://yarnpkg.com/en/docs/cli/) that implements a stricter version of workspaces
- [Yarn](https://yarnpkg.com/en/docs/cli/) - Yarn can be used to run npm-scripts instead of bolt
- [Yalc](https://github.com/whitecolor/yalc/) - This is used in one method of [Locally linking with products](linking-with-products)

### Package builds

- [Typescript](https://www.typescriptlang.org/index.html) - The Typescript Compiler (tsc) is used to compile and typecheck typescript code
- [Entrypoints](./04-entry-points.md) - We support the concept of creating additional entry points into packages to help with treeshaking
- **DEPRECATED**: [Flow](https://flow.org/) - Used to typecheck legacy JS packages that have not been converted to Typescript yet

### Testing & Linting

- [Jest](https://jestjs.io/) - Used to run the majority of tests
- [ESLint](https://eslint.org/) - Lints both TS & JS code

### Local Development Environment

- [Webpack](https://webpack.js.org/) - Builds and runs the Atlaskit website locally

### CI & Releases

- [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines) - Integrated CI solution
- [Netlify](https://www.netlify.com/) - Hosts staging and production versions of the Atlaskit website
- [Landkid](https://github.com/atlassian/landkid) - Used to merge PRs in a queue to avoid red master
- [Changesets](https://github.com/atlassian/changesets) - Manages package versioning and changelogs

[product-integration]: https://atlaskit.atlassian.com/docs/build/product-integration
[linking-with-products]: https://atlaskit.atlassian.com/docs/build/local-linking-with-products
[branch-deploys]: https://atlaskit.atlassian.com/docs/build/branch-deploys
[release-workflow]: https://atlaskit.atlassian.com/docs/build/release-workflow
