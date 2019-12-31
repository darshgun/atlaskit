# Contributing to Atlaskit

Thank you for your interest in contributing to Atlaskit!

Contribution is currently **only** available for Atlassian employees.

We’re temporarily unable to grant contributor access to external developers.

For **Atlassians**, if you want to make a request, suggest an improvement or raise a bug about Atlaskit, identify the relevant team that maintains the package by checking the [packages list][packages].

You can add a ticket through the appropriate channel:

- **Core**: Slack: [#atlaskit][#atlaskit] | Jira: [go/dst-sd][core]

- **Editor**: Slack: [#help-twp-editor][#help-twp-editor] | Jira: [go/editor-issue][editor]

- **Media**: Slack: [#help-twp-media][#help-twp-media] | Jira: - [go/mediahelp][media]

- **Elements**: Head over [Fabric Elements][fabric-elements] and reach out to the respective teams.

- **Search & Smarts**: [#smrt-quick-search][#smrt-quick-search] | “Give feedback” button in the search panel

- **Notifications**: [#notificationsplatform][#notificationsplatform]

## Code of Conduct

This project is bound by a [Code of Conduct][codeofconduct].

Lots more information about contributing to this project can also be found on our website. See [getting-started][getting-started] for more.

## Reporting Tickets

The Atlaskit repository is managed by several teams, we encouraged you check which team managed the package you want to raise the issue for and use the links above.

Before submitting a ticket, we kindly ask if the problem has already been reported using Slack channel or searching through the appropriate Jira project. If it has, add a comment to the existing issue instead of opening a new one.

### How do I submit a (good) bug report?

Follow these guidelines to help us and the community understand your issue, reproduce the behavior, and find other related/duplicate issues.

When you are creating a bug report, please include as many details as possible. Fill out [the required template](BUG_TEMPLATE.md) thoroughly to help us resolve issues faster.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible. Add a link to a codesandbox example using [this codesanbox](http://go.atlassian.com/ak-codesandbox) as starting point. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you opened a inline dialog, explain if you used the mouse, or a keyboard shortcut.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Include details about your configuration and environment:

- **Which version of the component are you using?** You can get this information by running `yarn list --pattern @atlaskit` or `npm list | grep '@atlaskit'` from the command line.
- **What's the name and version of the browser and OS you're using**?

## Code Contributions

### Why should I contribute?

1. While we strive to look at new tickets as soon as we can, because of the many priorities we juggle and limited resources, tickets raised often don't get looked into soon enough.
2. We want your contributions. We are always trying to improve our docs, processes and tools to make it easier to submit your own changes.
3. With the build system and auto-deployment to npm, using Atlaskit components in your projects simplifies your development stack. Treat Atlaskit as part of your codebase and make changes in it.
4. At Atlassian, "Play, As A Team" is one of our values. We encourage cross team contributions and collaborations.

# Contributing code to Atlaskit

Welcome to the Atlaskit repo!

A more in-depth view of how we want to work with other teams contributions can be found in the
[contributing guide on the Atlaskit website](https://atlaskit.atlassian.com/docs/guides/contributing).

If you have any questions/problems with the repo or codebase, please consult the links at the top of this file.

With all that being said, let's dive into it!

For more in-depth guides to developing in Atlaskit in addition to below, see the [docs](https://atlaskit.atlassian.com/docs/getting-started) section of the website.

## Development environment

### Requirements

- [git](https://git-scm.com/) version 2 or above for version control management.
- [node](https://nodejs.org/) version should be as listed in .nvmrc (we recommend using [nvm](https://github.com/creationix/nvm)). Run `nvm use` in the root directory to install the correct version of node.
- [yarn](https://yarnpkg.com/) version 1 or above.
- [bolt](https://github.com/boltpkg/bolt) version 0.20 or above.

### Setting up the development environment

To clone the repository, open up your terminal and run the following:

```sh
git clone git@bitbucket.org:atlassian/atlaskit-mk-2.git
cd atlaskit-mk-2
```

Then you'll need both [Node.js](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/) installed.

If you're on a Mac and have [Homebrew](https://brew.sh/) you can run:

```sh
brew install node yarn
```

> **Note:** You must be on Node >=8.4 and Yarn >=1.0

Then you can install [Bolt](https://github.com/boltpkg/bolt):

```sh
yarn global add bolt
```

Now that you have everything you need, you can bootstrap the Atlaskit repo:

```sh
cd atlaskit-mk-2
bolt install
```

This will take a minute or two the first time, but every subsequent run should
only take about a second.

Since this is a git-lfs repo, turn on lfs hooks for code push by running:

```sh
yarn enable:lfs
```

You're now ready to start developing in Atlaskit!

#### Linux / Mac / Windows

The main `bolt` / `bolt install` commands work on all platforms. However, custom commands may not work in a Windows environment (i.e. `bolt start`). For now, if you're running Windows, you'll have to do the following:

1. Run `bolt` / `bolt install` from `cmd.exe`. It doesn't work in WSL.
2. Run any custom commands from WSL. We haven't made our custom scripts cross-platform yet.

#### In case you use IntelliJ IDEA or WebStorm

After running `bolt install` you will most likely experiencing issues with IDE indexing taking forever. VS Code does not have this problem. If you do not want to change the IDE you use, do the following:

1. Close IntelliJ
1. run in terminal
   ```
   {find . -type d -name 'node_modules' | grep 'node_modules$' | grep -v 'node_modules/' | while read line ; do echo "<excludeFolder url=\"file://\$MODULE_DIR$/$line\" />"; done;} | pbcopy
   ```
   This will find paths to each node_modules/ folder in the project, create <excludeFolder> tags for each of them and copy resulting text to clipboard
1. Open `.idea/atlaskit-mk-2.iml` in your favorite text editor.
1. Pres Ctrl + V to paste text from clipboard after existing `<excludeFolder>` tags. Or paste inside `<content>` if you do not have `<excludeFolder>` tags. Save the file.
1. Open IntelliJ. You should be fine

Unfortunately, you will have to repeat this process if you pulled repository and new packages were introduced.

The root of this problem is in cyclical symbolic links between packages in node_modules, which exist because atlaskit-mk-2 is a mono repository.
IntelliJ and WebStorm don't handle it properly. There are tickets raised in YouTrack to handle this situation.

## Exploring the Project

See the [directory structure docs](https://atlaskit.atlassian.com/docs/guides/directory-structure) for
more information.

## Getting started with a package

Each component or utility lives in its own package under the `packages` directory.

You can start the development server for a specific component using
`yarn start <pkg-name>`, for example:

```sh
yarn start button
```

This will start the dev server with only packages matching the "button" pattern, served on http://localhost:9000.

You can start the development server for multiple components by separating the package names by a space, for example:

```sh
yarn start button modal-dialog
```

## Writing new code

All new code should be written using [TypeScript](http://www.typescriptlang.org/), using [Flow](https://flow.org) is now deprecated.

If you need to create a new package, simply create a directory for the package
and start putting files in the correct location (most things are based on file
conventions).

## Managing dependencies

If you're inside of a package directory, you should use the Bolt versions of Yarn's
existing add/upgrade/remove commands to modify the dependencies.

```sh
bolt add <dep>[@<version>] [--dev/peer/etc]
bolt upgrade <dep>[@<version>] [--dev/peer/etc]
bolt remove <dep>[@<version>] [--dev/peer/etc]
```

You can also manage dependencies for the project package, a specific workspace
package, or across all workspaces:

```sh
bolt project <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
bolt workspace <pkg-name> <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
bolt workspaces <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
```

> Note that there are additional restrictions to dependencies in Bolt than there
> are in Yarn, so you should not use `yarn` to manage dependencies.

For all other commands, you can use `yarn` since `bolt` will passthrough to `yarn` anyway. The benefits of using `yarn` over `build` are a slightly faster
execution time and less bolt logging.

## Type checking your code

We use [TypeScript](http://www.typescriptlang.org/) inside of Atlaskit, however there are some packages that still use [Flow](https://flow.org/) and
have not been migrated to TypeScript yet.
All new code should be TypeScript.

Be sure to setup IDE integrations for both so you get the full benefits out of
them.

- Atom: [IDE](https://ide.atom.io/)
- Sublime: [Flow](https://flow.org/en/docs/editors/sublime-text/),
  [TypeScript](https://github.com/Microsoft/TypeScript-Sublime-Plugin)
- Vim: [Flow](https://flow.org/en/docs/editors/vim/),
  [TypeScript](https://github.com/leafgarland/typescript-vim)
- VSCode: [Flow](https://flow.org/en/docs/editors/vscode/), TypeScript
  (built-in)

If you want to run both type checkers on all files from the command line you can
run:

```sh
yarn typecheck
```

## Linting your code

We use ESLint to lint all JavaScript (with and without Flow annotations) and TypeScript code within Atlaskit.

You'll probably want to setup IDE integrations for both within your editor,
doing so will ensure that you don't have to go back and fix up lots of code
later on.

- Atom: [ESLint](https://github.com/AtomLinter/linter-eslint),
- Sublime: [ESLint](https://github.com/roadhump/SublimeLinter-eslint),
- Vim: [Syntastic](https://github.com/vim-syntastic/syntastic)
- VS Code: [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),

To run the linter on all files from the command line you can run:

```sh
yarn lint
```

To run the linter on only a subset of files, you'll need to take the contents of the relevant lint npm script, e.g. `lint:eslint` and change the
file globs to only the subset you care about, e.g. `yarn eslint 'packages/core/button/*.{js,ts,tsx}'`

## Creating examples

To create a new example for a component, you can create a new file in the
component package's `examples/` folder.

```
/atlaskit-mk2/packages/core/avatar/examples/
├── 0-overview.js
└── 1-groups.js (New File)
```

Inside of the example you should import components by their package name
instead of a relative path.

```js
import React from 'react';
import { Presence } from '@atlaskit/avatar';

export default function Example() {
  return <Presence presence="online" />;
}
```

## Running dev locally

In order to view these examples within your browser, from the root of atlaskit-mk2 you can run:

### Single package

```sh
yarn start <pkg>
```

where `<pkg>` is a package name without the `@atlaskit/` prefix.

e.g.

```sh
yarn start button
```

### Multiple packages

If you need to start more than one packages, you can do:

```sh
yarn start button toggle tabs
```

It will start button, toggle and tabs packages on your local server.

### All packages in a team

Sometimes you really only want to run a small subset of examples. Depending on what you are trying to achieve the following scripts might be useful:

```sh
yarn start:core # start the website only for packages under packages/core
yarn start:media # start the website only for packages under packages/media
yarn start:editor # start the website only for packages under packages/editor
# See the npm scripts in package.json
```

### Running all packages

```sh
yarn start
```

however this will take a long time so is unwise to run locally.

To run the examples on a different port, set the `ATLASKIT_DEV_PORT` environment variable.

```sh
ATLASKIT_DEV_PORT=9001 yarn start
```

## Testing your code

### Running tests

- unit tests

```sh
 yarn jest <pkg-path>
```

where `<pkg-path>` is a relative path/glob to the directory/file you want to test

- browser unit tests

```sh
 yarn run test:browser
```

- webdriver tests

```sh
 yarn run test:webdriver
```

- visual regression tests

```sh
yarn run test:vr
```

Please refer to [testing in atlaskit][testing] for more information about testing.

## Building packages

To build all packages, run `yarn build` - although this may take quite a while. See [individual package builds](#individual-package-builds) to build single packages only.

Our build process has multiple steps, some of which are conditional based on the type of package being built. We infer the type of package
based on rules defined in [build/utils/tools.js](./build/utils/tools.js). For example, packages still using JS + flow will be compiled using babel whereas
TypeScript packages will be compiled using tsc.

Some packages require additional build steps that are unique to that package. We expose a `ak-postbuild` npm script hook that packages can use for these custom
build steps. The script will be executed after the main build step. We recommend talking to the build team in #atlaskit-build to discuss any alternatives before
using this approach.

### Individual package builds

See [Individual package builds](individual-package-builds)

## Linking packages

See the [Linking guide](local-linking).

## Documenting your code

Inside of every package is a `docs/` folder which includes all of the
documentation pages (there's generally only one).

These pages are then displayed on the website and can be navigated to when viewing
the package in question.

```
/atlaskit-mk2/packages/core/avatar/docs/
├── 0-overview.js
└── 1-groups.js
```

Each of these files looks something like this:

```js
// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  # Avatar

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a tempor
  ex. Cras nisl magna, luctus in facilisis at, mattis sed lacus.

  ${<Example source={...} />}

  ${<Props source={...} />}
`;
```

## Releasing packages

Packages are released automatically once they reach `master` and are done so
using `Changeset` commits.

When you wish to release a package, simply run `yarn changeset` and the wizard
will guide you.

When releasing a package, you will also need to bump the dependencies of all
packages that depend on that package, the wizard will prompt for the type of
change for each of these releases (`patch`, `minor` or `major`).

The `summary` used during the creation of a changeset will also be used to
create the changelog entry for each package being released.

> **How does this work?** Running the `yarn changeset` command creates a commit
> with all the information required to release a package. When a branch is
> merged to master, all the unreleased changesets are combined, new versions are
> calculated, packages and dependencies are updated, changelogs are generated
> and packages are released

More information about this can be found [here][releasing-packages] and in the [faq][faq]

## Submitting pull requests

When you are ready to submit a change to Atlaskit, you should raise a pull request.

Push your code to a branch on the Atlaskit repository itself.
Do not raise pull requests from forks because our CI builds do not run on forks.

The smaller your change, the more likely it will be accepted, and the sooner it is likely to be merged.

If you are making multiple unrelated changes to Atlaskit, please submit them in multiple pull requests.

Be sure that your request includes tests for new features and bug fixes.
Consult our [testing guidelines][testing] for further details.

Ensure your code follows the existing code style and conventions.

Once your pull request has been reviewed and approved by an Atlaskit maintainer, you will need an Atlaskit
maintainer to merge the change.

[codeofconduct]: ./CODE_OF_CONDUCT.md
[#atlaskit]: https://atlassian.slack.com/messages/CFHT33S4F
[#help-twp-editor]: https://atlassian.slack.com/archives/CFG3PSQ9E
[#help-twp-media]: https://atlassian.slack.com/archives/CFGMGT77W
[fabric-elements]: https://product-fabric.atlassian.net/wiki/spaces/FS
[#smrt-quick-search]: https://atlassian.slack.com/archives/CFG8QANL9
[#notificationsplatform]: https://atlassian.slack.com/archives/CFG86D0HF
[core]: https://ecosystem.atlassian.net/servicedesk/customer/portal/24
[editor]: https://product-fabric.atlassian.net/projects/ED/issues/ED-4385?filter=allissues
[media]: https://product-fabric.atlassian.net/servicedesk/customer/portal/2
[packages]: https://atlaskit.atlassian.com/packages
[testing]: https://atlaskit.atlassian.com/docs/guides/testing
[releasing-packages]: https://atlaskit.atlassian.com/docs/guides/releasing-packages
[getting-started]: https://atlaskit.atlassian.com/docs/getting-started
[faq]: https://atlaskit.atlassian.com/docs/guides/frequently-asked-questions
[local-linking]: https://atlaskit.atlassian.com/docs/build/local-linking-with-products
[individual-package-builds]: https://atlaskit.atlassian.com/docs/build/individual-package-builds
