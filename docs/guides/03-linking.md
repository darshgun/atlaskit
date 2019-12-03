# Locally linking in Atlaskit

## Usage

Linking packages in Atlaskit is more difficult than the standard workflow of running the built-in `yarn link` command. This is because of the majority of packages in the repo need to be built as `yarn link` uses symlinks and building all packages in the repo takes a significant amount of time.

To handle this problem, we provide two main ways of linking packages:

<a id="option-a"></a>

### A) Linking a _single_ package that is a direct dependency of another repo

#### Pre-requisites

- The package you've made changed to is a direct dependency of your target repo. I.e. it's directly imported by the repo, and not by another atlaskit package
- The package does not rely on any local changes to its dependencies. I.e. you don't need to locally link the packages dependencies as well

#### `yarn link-pkg <repo> <pkg>` + `yarn watch <pkg>`

We provide a `yarn link-pkg` command to link a package to another repo, provided it is a direct dependency. Under the hood it uses [Yalc](https://www.npmjs.com/package/yalc)
to copy packages to another repo as a `file:...` dependency.

This links and builds only a single package and none of its dependencies, so is a faster way of linking than [option B](#option-b) but only covers a subset of use cases.

Run the following steps:

1. `yarn link-pkg <repo_path> <package>`

   E.g. `yarn link-pkg ../confluence-frontend editor-core`.

   You can run `yarn link-pkg --help` for more info.

2. `yarn watch <package>`

   E.g. `yarn watch editor-core`.
   The command just runs `yarn build <pkg>` in watch mode and pushes changes to any linked repos. Run `yarn watch --help` for more info.

**Note**: Linking a single package suffers the same caveats as [individual package builds](../../CONTRIBUTING.md#individual-package-builds), namely type definitions from other packages in the repo will be coerced to any. If this is a problem for you, you can instead follow the steps in [Linking a package that is a transitive dependency of another repo](#Linking-a-package-that-is-a-transitive-dependency-of-another-repo) which does a full repo build instead.

<a id="option-b"></a>

### B) Linking a package and all of its dependencies / Linking a package that is a transitive dependency

#### Pre-requisites

- You need to link a package that isn't directly imported from the target repo, e.g. usage of media-card inside editor-core, or a peer dependency, e.g. media-core.

#### `yarn link <repo> <pkg>` + `yarn build` + `yarn watch <pkg>`

Linking a package and all of its dependencies, or linking a package that is only a transitive dependency, is a bit trickier to do in an efficient manner. This is because we need to build all transitive dependencies of the linked package that is a direct dependency of the target repo.

As a result, we need to do a full atlaskit project build. We are looking into improving this in the future though by using [Typescript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) to enable incremental builds across the entire repo and allow building all of a packages dependencies.

Run the following steps:

1. Link the package that is a direct dependency of the target repo: `cd <package_dir> && yarn link`

   E.g. `cd packages/editor/editor-core && yarn link`

2. `cd <repo_dir> && yarn link <full_package_name>`

   E.g. `cd ../confluence-frontend && yarn link @atlaskit/editor-core`

3. Run the full build if you haven't ran it already or it is out of date, otherwise you can skip: `yarn build`.

   To speed this up, you can specify that only a specific dist type is built with `yarn build --distType esm`.

   Note that our packages expose their `d.ts` files through the `cjs` build, so if you only build `esm`, you will experience the same caveats as [individual package builds](../../CONTRIBUTING.md#individual-package-builds) and `link-pkg` where certain types are coerced to `any`.

4. Run the package you're working on in watch mode: `yarn watch <package>`

   E.g. `yarn watch editor-core`

**Note**: Be careful with specifying the 'cjs' distType. If you have already built the 'esm' dists, the product repo will most likely only be reading that, resulting in no changes being picked up.

**Note**: There is a chance your local full builds become stale if you haven't ran them in a while and depend on more recent code that hasn't been built. In that case,
you can either rerun the full build or [build the individual packages](../../CONTRIBUTING.md#individual-package-builds) you know need to be rebuilt.

**Note**: This method uses native `yarn link`, you may experience problems with peer dependencies resolving to different locations depending on whether they are imported from within Atlaskit or the target repo, resulting in multiple instances of peer dependencies being instantiated. If that becomes a problem, you will have to try some of the solutions suggested here: https://stackoverflow.com/q/31169760/893630

## FAQ

[How do I link multiple packages?](#link-multiple-packages)

[How do I clean or delete built packages?](#clean-packages)

<a id="link-multiple-packages"></a>

### How do I link multiple packages?

To link multiple packages, you'll need to run the linking steps individually for each package.

We'll be able to make this easier in the future when we have Typescript Project References as we'll be able to run watch mode across the entire repo instead of having to run it for individual packages. We are also looking to add the ability to link multiple packages in an easy way, such as all changed packages in a branch, using changesets or accepting a list of packages.

<a id="clean-packages"></a>

### How do I clean or delete built packages?

You can run the `yarn delete:build:artifacts` command to delete built package artifacts such as dist folders and entry point directories.

## Troubleshooting

[My watched changes are not triggering a recompile in the target repo](#not-recompiling)

[There are a lot of errors being reported in yarn watch](#lots-of-errors)

[Some transitive dependencies are out of date or causing me problems when using yarn link](#stale-deps)

[My full repo yarn build fails when running with a single distType](#full-build-disttype)

[My package's postbuild script is not re-running on build](#no-postbuild)

[Multiple instances of peer dependencies such as styled-components/react are causing issues](#peer-dependencies)

<a id="not-recompiling"></a>

### My watched changes are not triggering a recompile in the target repo

Firstly, make sure that the target repo's dev server is not ignoring 'node_modules/@atlaskit' as part of its watch mode.
E.g. for webpack

```js
devServer: {
  ...
  watchOptions: {
    // Ignore all node_modules except  @atlaskit
    ignored: /node_modules\/(?!@atlaskit)/,
    ...
  },
```

Secondly, make sure that you are building both dist types as part of your `yarn watch` command. If you build one dist type, you chance the risk that the target repo is reading from the other dist type if it already exists. This issue usually only presents itself when running `yarn link`.

Finally, ensure you're `yarn watch`ing the right package. If you are not watching the package you linked, you'll need to make sure you're using the [transitive dependency option B](#option-b) method of linking using `yarn link` so that your transitive dependency changes are picked up.

<a id="lots-of-errors"></a>

### There are a lot of errors being reported in yarn watch

This is a known issue related to the fact that we are building a single package in isolation. Other atlaskit package types are not built and so typescript reports 'module not found' errors. These just result in types being coerced to any where used, so shouldn't cause a problem in the target repo. See the caveat in same caveats as [individual package builds](../../CONTRIBUTING.md#individual-package-builds)

<a id="stale-deps"></a>

### Some transitive dependencies are out of date or failing in product when using yarn link

If you haven't run a full `yarn build` in a while and are using `yarn link`, you run the risk of the transitive dependencies of your package becoming stale, which can cause build or runtime errors in the target repo.

If you know which packages are causing you problems you can run `yarn build <pkg>` to build the package individually. Alternatively, you can run the full build again to be certain that you are up to date.

<a id="full-build-disttype"></a>

### My full repo yarn build fails when running with a single distType

Postbuild scripts may rely on both dist types being built to succeed. These scripts will fail when building a single dist type. The solution is to fix the postbuild script to gracefully handle dist type folders not existing.
We run a separate dist validation step at the end of the build to verify that these folders do exist with correct files, so this does not need to be done in postbuild scripts.

<a id="no-postbuild"></a>

### My package's postbuild script is not re-running on build

Currently, we only execute the postbuild script once as part of the initial build of a package. If you need this to run after each update, you'll need to manually run `yarn build <package>` after each change. If this is a problem for you, let us know.

<a id="peer-dependencies"></a>

### Multiple instances of peer dependencies such as styled-components/react are causing issues

This is one of the downsides to using the native `yarn link` method of linking. The problem arises because of node's module resolution resolving a peer dependency to two different places depending on whether it was imported inside the linked dependency or in the target repo.

This may not be a problem for all peer dependencies, e.g. react, as they should try to gracefully handle multiple instances running on the same page, but if they do cause issues then you can try solutions suggested here: https://stackoverflow.com/q/31169760/893630.

The easiest approach would be linking the peer dependency from atlaskit to the target repo or vice versa.

E.g.

```sh
confluence-frontend $ cd node_modules/styled-components && yarn link
atlaskit $ yarn link styled-components
```
