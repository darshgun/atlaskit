---
'@atlaskit/branch-deploy-product-integrator': minor
---

- The `push` command will now add a `.atlaskit-version` file to product repos with information pertaining to the atlaskit commit that was branch deployed. Currently it contains the atlaskit commit hash. This aids in linking branch deploys in products back to atlaskit commits.
