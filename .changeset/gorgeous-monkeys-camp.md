---
'@atlaskit/branch-deploy-product-integrator': major
---

- The branch-deploy-product-integrator now has sub-commands to allow further commands in the future such as reporting build statuses.

  The default behaviour now resides under the `push` command and has some API changes of itself.

  The two mandatory `atlaskitBranchName` and `atlaskitCommitHash` flags are now positional arguments.

  Changes:

  Old: `branch-deploy-product-integrator --atlaskitBranchName foo --atlaskitCommitHash abcdefg --cmd add`
  New: `branch-deploy-product-integrator push foo abcdefg --cmd add`
