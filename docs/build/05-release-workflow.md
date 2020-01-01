# Release Workflow

The [Scheduled Releases][scheduled-releases] is the default release workflow of the repository. This is similar to the 'git flow' release model.

Branches are branched off and merged to the `develop` branch, a `release-candidate/` branch is created off `develop` every ~2 weeks, stabilised & tested for a week and then merged to `master` where all packages will then be released.

See [Scheduled Releases][scheduled-releases] for more details on the process and [here][schedule] for the schedule.

[scheduled-releases]: https://product-fabric.atlassian.net/wiki/spaces/AFP/pages/986055983
[schedule]: https://product-fabric.atlassian.net/secure/Roadmap.jspa?projectKey=FABDODGEM&rapidView=386
