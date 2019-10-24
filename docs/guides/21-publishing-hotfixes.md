# How to publish Hotfixes

Hotfix releases are possible but should be avoided where **at all possible**. They introduce lots of room for mistakes and create a manual maintenance problem that we'd like to avoid.

> **All hotfixes must be approved by either the build team or an Atlaskit architect**

## 1. Checkout defective commit

Checkout the commit or tag you are branching from and create a new branch from there. e.g.

```
git checkout @atlaskit/avatar@1.1.0               # you will be in a detached head state
git checkout -b hotfix/avatar-hotifx-for-stride   # create the new branch
```

## 2. Clean the workspace

Ensure that your workspace is completely clean (this ensures any testing isn't affected by changes on your local machine).

```
git clean -dfx    # removes all untracked files and directories
```

then perform a normal `bolt install`

```
bolt install
```

## 3. Appling changes

Apply manual changes and test **thoroughly**. It is extremely important that this is done correctly. How you test will depend on exactly what you are fixing, but in general building the package you are changing and `yarn link`'ing it will be useful.

## 4. Versioning

Once you are completely satisfied that the change is correct, manually change its version. The hotfix version should be the next available patch version, relative to the defective version. So if the defective version is `1.5.2` the hot fix version should be `1.5.3`. If that was already taken, check 1.5.4, 1.5.5, etc. Use `npm view [package] versions` to get a list of all published versions of a package. For example: `npm view @atlaskit/avatar versions`

```
"name": "@atlaskit/avatar"
"version": "1.5.3"
```

Commit the work to your branch with a git tag and descriptive message (no changeset required). The `-m` flag is very important here as `git push --follow-tags` behaves strangely depending on if this is present.

```
git commit -m "Hotfix for avatar to expose forgotten proptypes in version 1.5.0"
git tag @atlaskit/avatar@1.5.3 -m "@atlaskit/avatar@1.5.3"
```

## 5. Building

The single safest way to ensure that a package is built correctly is to run the entire yarn build script. This will build the entire repository but will obviously take longer. Although there is a script for building a single package, it can sometimes have slightly wrong types if its dependencies were not built first. If you need to run the build multiple times for testing, the safest option is to build the whole repo first and then use the single package build scripts from then on.

Manually triple check that the built dist looks correct. Compare it to a previous version on npmcdn (i.e [https://npmcdn.com/@atlaskit/avatar@1.1.0/dist/](https://npmcdn.com/@atlaskit/avatar@1.1.0/dist/)). Does it have the right directories, files, do the exports looks right, etc.

## 6. Publishing

Ensure that you are logged in as the `atlaskit` npm user. Credentials should be accessible on Lastpass if requried. If you do not have access to the credentials, reach out to a member of the Atlaskit Build, Editor or Design System team.

To login run `npm login` and follow the prompts. Then ensure that you're logged into the correct account with `npm whoami`.

Finally, run `npm publish` in the package's directory. The `--tag` argument is passed to make sure npm doesnt mark this release as `latest`, which is does by default.

```
cd packages/core/avatar
npm publish --tag="hotfix"
```

Confirm that we definitely haven't changed the `latest` tag

```
$ npm info @atlaskit/avatar dist-tags
{ latest: '17.1.3', hotfix: '1.5.3' }
```

Push the branch with tags up for future reference.

```
git push --follow-tags
```

## 7. Recording

Once you've published a hotfix, be sure record all relevant information about the fix on this page: [go/ak-hotfixes](https://product-fabric.atlassian.net/wiki/spaces/DPT/pages/993627202/Published+Hotfix+Register), so it can be referenced and tracked in the future.
