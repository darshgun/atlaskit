---
'@atlaskit/branch-deploy-product-integrator': patch
---

Don't trigger product CI if no changes were committed. This prevents an issue where a product CI branch build is created when a git branch hasn't been created
