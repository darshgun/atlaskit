Add --productCiPlanUrl flag that will create a branch build in product for the branch if one has not already been created. This is required for triggering builds on product CIs that are configured to only create branch builds when a PR has been created.
Add extra validation to throw when mandatory flags aren't passed or when any unsupported flags are passed.
