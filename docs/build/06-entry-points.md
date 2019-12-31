# Entry points

We provide a method of adding entry points to a package to aid in treeshaking.

For example,

Importing from the package normally: `import { colors } from '@atlaskit/theme';`
Importing via an entry point: `import colors from @atlaskit/theme/colors;`

Currently all files directly underneath `<package>/src` are generated as entry points. We will change this in the future to be configurable on a per-package basis, however, so that we do not needlessly create unnecessary entry points and ensure that explicit entry points are well documented.

There are two parts to entry points:

- Entry point generation
- Typescript `paths` configuration

The entry points are generated at build time by searching for all top-level files under `<package>/src` and generating directories for each directly underneath the root. Inside each directory is a generated `package.json` that contains both a `main` and `module` entry to allow the entry point to support both `cjs` and `esm` dist types. Since the entry point directory is at the root, it can be directly imported by appending the entry point path to the package, e.g. `@atlaskit/theme/colors`.

A typescript paths configuration is required for packages that reference an entry point of another package to compile correctly. To do this we maintain an automatically generated `tsconfig.entry-points.json` that lists each entry point as a separate `paths` configuration. The `build:multi-entry-point-tsconfig` npm-script must be run to regenerate this file each time an entry point is added.
