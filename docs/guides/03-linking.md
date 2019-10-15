# Locally linking in Atlaskit

## Usage

Linking packages in Atlaskit is more difficult than the standard workflow of running `yarn link`. This is because of the majority of packages in the repo need to be built because `yarn link` uses symlinks and building all packages in the repo takes a significant amount of time.

To handle this problem, we provide two main ways of linking packages:

<a id="option-a"></a>

### A) Linking a _single_ package that is a direct dependency of another repo

#### Bolt link-ak <repo> <pkg> + Bolt watch <pkg>

We provide a `bolt link-ak` command to link a package to another repo, provided it is a direct dependency. Under the hood it uses [Yalc](https://www.npmjs.com/package/yalc)
to copy packages to another repo as a `file:...` dependency.

This links and builds only a single package, so has a much faster initial setup time than the second option of building all packages below.

Run the following steps:

1. `bolt link-ak <repo_path> <package>`

   E.g. `bolt link-ak confluence-frontend editor-core`.
   You can run `bolt link-ak --help` for more info.

2. `bolt watch <package>`

   E.g. `bolt watch editor-core`.
   The command just runs `bolt build <pkg>` in watch mode and pushes changes to any linked repos. Run `bolt watch --help` for more info.

**Note**: Linking a single package suffers the same caveats as [individual package builds](../../CONTRIBUTING.md#individual-package-builds), namely type definitions from other packages in the repo will be coerced to any. If this is a problem for you, you can instead follow the steps in [Linking a package that is a transitive dependency of another repo](#Linking-a-package-that-is-a-transitive-dependency-of-another-repo) which does a full repo build instead.

<a id="option-b"></a>

### B) Linking a package and all of its dependencies / Linking a package that is a transitive dependency

#### Yarn link <repo> <pkg> + Bolt build + Bolt watch <pkg>

Linking a package and all of its dependencies, or linking a package that is only a transitive dependency, is a bit trickier to do in an efficient manner. This is because we need to know the direct dependencies of the target repo that the linked package is a transitive dependency of and link any intermediate dependencies.
At the moment we don't have tooling to support linking transitive dependencies with reduced build times, so linking them will require a full build. We are looking into improving this in the future though by using [Typescript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) to enable incremental builds across the entire repo.

Run the following steps:

1. Link the package that is a direct dependency of the target repo: `cd <package_dir> && yarn link`

   E.g. `cd packages/editor/editor-core && yarn link`

2. `cd <repo_dir> && yarn link <full_package_name>`

   E.g. `cd ../confluence-frontend && yarn link @atlaskit/editor-core`

3. Run the full build if you haven't ran it already or it is out of date, otherwise you can skip: `bolt build`.

   To speed this up, you can specify that only a specific dist type is built with `bolt build --distType esm`.

   Note that our packages expose their `d.ts` files through the `cjs` build, so if you only build `esm`, you will experience the same caveats as [individual package builds](../../CONTRIBUTING.md#individual-package-builds) and `link-ak` where certain types are coerced to `any`.

4. Run the package you're working on in watch mode: `bolt watch <package>`

   E.g. `bolt watch editor-core`

**Note**: Be careful with specifying the 'cjs' distType. If you have already built the 'esm' dists, the product repo will most likely only be reading that, resulting in no changes being picked up.

**Note**: There is a chance your local full builds become stale if you haven't ran them in a while and depend on more recent code that hasn't been built. In that case,
you can either rerun the full build or [build the individual packages](../../CONTRIBUTING.md#individual-package-builds) you know need to be rebuilt.

**Note**: This method uses native `yarn link`, you may experience problems with peer dependencies resolving to different locations depending on whether they are imported from within Atlaskit or the target repo, resulting in multiple instances of peer dependencies being instantiated. If that becomes a problem, you will have to try some of the solutions suggested here: https://stackoverflow.com/q/31169760/893630

## Troubleshooting / FAQ

[My watched changes are not triggering a recompile in the target repo](#not-recompiling)

[There are a lot of errors being reported in bolt watch](#lots-of-errors)

[Some transitive dependencies are out of date or causing me problems when using yarn link](#stale-deps)

[My full repo bolt build fails when running with a single distType](#full-build-disttype)

[My package's postbuild script is not re-running on build](#no-postbuild)

[How do I link multiple packages?](#link-multiple-packages)

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

Secondly, make sure that you are building both dist types as part of your `bolt watch` command. If you build one dist type, you chance the risk that the target repo is reading from the other dist type if it already exists. This issue usually only presents itself when running `yarn link`.

Finally, ensure you're `bolt watch`ing the right package. If you are not watching the package you linked, you'll need to make sure you're using the [transitive dependency option B](#option-b) method of linking using `yarn link` so that your transitive dependency changes are picked up.

<a id="lots-of-errors"></a>

### There are a lot of errors being reported in bolt watch

This is a known issue related to the fact that we are building a single package in isolation. Other atlaskit package types are not built and so typescript reports 'module not found' errors. These just result in types being coerced to any where used, so shouldn't cause a problem in the target repo. See the caveat in same caveats as [individual package builds](../../CONTRIBUTING.md#individual-package-builds)

<a id="stale-deps"></a>

### Some transitive dependencies are out of date or failing in product when using yarn link

If you haven't run a full `bolt build` in a while and are using `yarn link`, you run the risk of the transitive dependencies of your package becoming stale, which can cause build or runtime errors in the target repo.

If you know which packages are causing you problems you can run `bolt build <pkg>` to build the package individually. Alternatively, you can run the full build again to be certain that you are up to date.

<a id="full-build-disttype"></a>

### My full repo bolt build fails when running with a single distType

There is a known issue with some postbuild scripts where they rely on both dist types being built to succeed. These scripts will fail when building a single dist type.
For the most part, they can be ignored unless they have not run for the dist type that you have built. If this is the case, try running the postbuild script for the package that is causing you problems.

<a id="no-postbuild"></a>

### My package's postbuild script is not re-running on build

Currently, we only execute the postbuild script once as part of the initial build of a package. If you need this to run after each update, you'll need to manually run `bolt build <package>` after each change. If this is a problem for you, let us know.

<a id="link-multiple-packages"></a>

### How do I link multiple packages?

To link multiple packages, you'll need to run the linking steps individually for each package.

We'll be able to make this easier in the future when we have Typescript Project References as we'll be able to run watch mode across the entire repo instead of having to run it for individual packages. We are also looking to add the ability to link multiple packages in an easy way, such as all changed packages in a branch, using changesets or accepting a list of packages.
