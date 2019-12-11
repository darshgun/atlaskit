---
'@atlaskit/ci-scripts': minor
'@atlaskit/build-utils': minor
---

- Update build tooling to:
  - Only build typescript packages with a `build/tsconfig.json` dir rather than any package with `tsconfig.json` in the root
  - Remove concept of cli packages with a `build/cli/tsconfig.json` and update them to use the standard cjs build
  - Allow limiting the typescript build targets of a package by specifying an `atlaskit.build.targets` property in package.json. This allows CLI packages for example, to only build CJS rather than both CJS and ESM
  - Separate the typecheck and typescript build properties in `getPackageInfo` to allow typechecking our build packages without attempting to build them
