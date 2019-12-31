# Branch deploys

Branch deploys are a way to publish changes to all packages you've made in your development branch to s3 as a published package bundle that can then be installed in a product via traditional `yarn` / `bolt` / `npm` commands.

This allows you to test your changes in as prod-like a way as possible and provides an easy way to test your changes in product before they are officially released to npm.

Note: The term branch deploys is slightly overloaded, it can refer to either the published package artifacts of your branch OR the process of building and publishing itself.

## Deploying

By default, every branch build will automatically perform a branch deploy containing all packages changed since either `develop` or `master` depending on which base branch you branched off.

There is also a manual way of branch deploying via the 'branch-deploy' custom pipeline. This allows you to specify a specific list of packages instead. This can be used if you want to integrate packages that you have not modified but may still be indirectly affected by your change.
To specify the packages, you must fill the 'Packages' custom variable with a JSON array of package paths, e.g.

```
["packages/editor/editor-core", "packages/core/spinner"]
```

_Note_: The custom pipeline will override the branch deploy performed as part of the default branch build. You will need to ensure you give the default build enough time to first perform its branch deploy before running the custom pipeline otherwise you run the risk of the manual branch deploy being overridden itself.

## Installing

Although you can manually install each package yourself from the s3 url that we deploy to, we have a CLI tool that can do this for you.
The only required argument it needs is the commit hash that the branch was deployed from.

```
$ yarn global add @atlaskit/branch-installer
$ cd <product-repo>
$ atlaskit-branch-installer <commitHash>
```

Run with the `--help` flag to get a full list of flags/args you can pass to it.

You can also run via `npx` if you don't want to install to the global namespace and ensure that you're always running the latest version.

Examples:

```
$ atlaskit-branch-installer 13793fa9939f --engine=bolt --cmd add --packages=@atlaskit/button,@atlaskit/editor-core
$ npx atlaskit-branch-installer 13793fa9939f
```

### Relevant sources:

- [bitbucket-pipelines.yml](pipelines)
- [branch-installer](branch-installer)
- [Announcement blog post](https://hello.atlassian.net/wiki/spaces/AFP/blog/2019/08/12/529888913/Atlaskit+Branch+Deployments+-+Announcement+FAQ)

[pipelines]: https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/bitbucket-pipelines.yml
[branch-installer]: https://bitbucket.org/atlassian/atlaskit-mk-2/src/HEAD/build/branch-installer
