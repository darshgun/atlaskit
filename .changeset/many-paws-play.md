---
'@atlaskit/branch-deploy-product-integrator': patch
---

Update integrator to merge with master and reset package.json/yarn.lock with master.
This fixes two issues:

1. Branch becoming out of date with master
2. Stale branch deploys of packages lingering in package.json when those packages are not in the latest branch deploy
