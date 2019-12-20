# @atlaskit/branch-deploy-product-integrator

## 2.0.3

### Patch Changes

- [patch][917c865a2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/917c865a2a):

  Meow is smarter than I thought and also converts "" to a boolean true, so had to add a typeof check

## 2.0.2

### Patch Changes

- [patch][ef95dce44d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef95dce44d):

  Add some extra url checks- [patch][89cbaaf5a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89cbaaf5a2):

  Add a length check to productCiPlanUrl

## 2.0.1

### Patch Changes

- [patch][6195035473](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6195035473):

  Update integrator to merge with master and reset package.json/yarn.lock with master.
  This fixes two issues:

  1. Branch becoming out of date with master
  2. Stale branch deploys of packages lingering in package.json when those packages are not in the latest branch deploy

## 2.0.0

### Major Changes

- [major][756b40834f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/756b40834f):

  - The branch-deploy-product-integrator now has sub-commands to allow further commands in the future such as reporting build statuses.

    The default behaviour now resides under the `push` command and has some API changes of itself.

    The two mandatory `atlaskitBranchName` and `atlaskitCommitHash` flags are now positional arguments.

    Changes:

    Old: `branch-deploy-product-integrator --atlaskitBranchName foo --atlaskitCommitHash abcdefg --cmd add`
    New: `branch-deploy-product-integrator push foo abcdefg --cmd add`

### Minor Changes

- [minor][48f9d44824](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48f9d44824):

  - The `push` command will now add a `.atlaskit-version` file to product repos with information pertaining to the atlaskit commit that was branch deployed. Currently it contains the atlaskit commit hash. This aids in linking branch deploys in products back to atlaskit commits.

### Patch Changes

- [patch][cafc62d2e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cafc62d2e4):

  Don't trigger product CI if no changes were committed. This prevents an issue where a product CI branch build is created when a git branch hasn't been created

## 1.3.0

### Minor Changes

- [minor][f957c2117c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f957c2117c):

  Add --productCiPlanUrl flag that will create a branch build in product for the branch if one has not already been created. This is required for triggering builds on product CIs that are configured to only create branch builds when a PR has been created.
  Add extra validation to throw when mandatory flags aren't passed or when any unsupported flags are passed.

## 1.2.0

### Minor Changes

- [minor][9bb012c1c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bb012c1c9):

  Replace slashes with dashes in branch name created in products. This ensures certain product integrations don't fail while allowing Atlaskit branche names to have slashes.

## 1.1.0

### Minor Changes

- [minor][5344193efa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5344193efa):

  Add support for passing arbitrary flags to the branch install command, i.e. yarn/bolt, by adding the flags after a '--' separator

## 1.0.5

### Patch Changes

- [patch][0ed6b4e90c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ed6b4e90c):

  Expose cmd and add a retry to the upgrade

## 1.0.4

- Updated dependencies [4dc307b4f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4dc307b4f9):
  - @atlaskit/branch-installer@0.2.0

## 1.0.3

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 1.0.2

### Patch Changes

- [patch][f5a3c7e7b9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f5a3c7e7b9):

  CLI's should return a non-zero return code when a error was thrown

## 1.0.1

### Patch Changes

- [patch][a955d95ac4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a955d95ac4):

  Added option to run yarn dedupe at the end

## 1.0.0

### Major Changes

- [major][348b1058fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/348b1058fd):

  First version of branch deploy integrator cli
