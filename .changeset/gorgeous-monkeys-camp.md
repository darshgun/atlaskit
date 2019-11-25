---
'@atlaskit/branch-deploy-product-integrator': major
---

- The branch-deploy-product-integrator now has sub-commands to allow further commands in the future such as reporting build statuses.

  The default behaviour now resides under the `push` command and has some API changes of itself.

  The two mandatory `atlaskitBranchName` and `atlaskitCommitHash` flags are now positional arguments.

  Changes:

  Old: `branch-deploy-product-integrator --atlaskitBranchName foo --atlaskitCommitHash abcdefg --cmd add`
  New: `branch-deploy-product-integrator push foo abcdefg --cmd add`

- The `push` command will now add a `.atlaskit-version` file to product repos with information pertaining to the atlaskit commit that was branch deployed. Currently it contains the atlaskit commit hash. This aids in linking branch deploys in products back to atlaskit commits.
