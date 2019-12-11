---
'@atlaskit/ci-scripts': minor
'@atlaskit/build-utils': minor
---

- Update build tooling to:
  - Only build typescript packages with a `build/tsconfig.json` dir rather than any package with `tsconfig.json` in the root
  - Remove concept of cli packages with a `build/cli/tsconfig.json` and update them to use the standard build
  - Separate the typecheck and typescript build properties in `getPackageInfo` to allow typechecking our build packages without attempting to build them
