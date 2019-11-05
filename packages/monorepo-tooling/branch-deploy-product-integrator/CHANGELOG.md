# @atlaskit/branch-deploy-product-integrator

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
