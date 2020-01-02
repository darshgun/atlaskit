# Individual package builds

Individual packages can be built by running `yarn build <pkg-name>`, e.g. `yarn build @atlaskit/button` or `yarn build button`.

You can also rebuild them in watch mode via the `--watch` flag.

Run `yarn build --help` for a full list of options.

One caveat with the individual package build is that typescript will emit errors whenever it encounters a transitive dependency that has not been built, saying

```
error TS2307: Cannot find module '@atlaskit/....'
```

Since we are currently suppressing errors that occur during `build` and relying on picking them up in `typecheck` (this will hopefully change soon), these errors don't cause any problems.

They will, however, affect the output of the d.ts files created for the package, as any types from an uncompiled dependency will be casted to `any`.
