# Typings

This directory contains typescript declaration (d.ts) files for modules that do not have their own type definitions, either from within the modules themselves or installed via @types. This is necessary because we have enabled the `noImplicitAny` tsconfig compiler option via the `strict` option, which will error if any expressions/declarations are inferred as `any`.

Each file must be specified in the `files` entry in the project root `tsconfig.json` to be included properly.
