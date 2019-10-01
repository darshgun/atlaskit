// Type definitions for bolt 0.24.1
// Project: https://github.com/boltpkg/bolt/#readme
// Definitions by: Michael B. <https://github.com/Blasz>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped (soon)

/// <reference types="node" />
declare module 'bolt' {
  type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
  interface JsonMap {
    [key: string]: AnyJson;
  }
  interface JsonArray extends Array<AnyJson> {}

  interface Cwd {
    cwd?: string;
  }

  /* Common types */
  export type Graph = Map<string, Array<string>>;

  export interface Package {
    dir: string;
    name: string;
    config: AnyJson;
  }

  export interface FilterOpts {
    only?: string;
    ignore?: string;
    onlyFs?: string;
    ignoreFs?: string;
  }

  export interface SpawnOpts {
    orderMode?: 'serial' | 'parallel' | 'parallel-nodes';
    bail?: boolean;
  }

  export interface PackageMeta {
    name: string;
    newVersion: string;
    published: boolean;
  }

  /* Standalone functions */
  export function getProject(opts?: Cwd): Promise<Package>;
  export function getWorkspaces(opts?: Cwd & FilterOpts): Promise<Package[]>;
  export function getDependencyGraph(opts?: Cwd): Promise<Graph>;
  export function getDependentsGraph(opts?: Cwd): Promise<Graph>;
  export function publishPackages(
    opts: Cwd & {
      access?: string;
      spawnOpts?: SpawnOpts;
      prePublish?: Function;
    },
  ): Promise<PackageMeta[]>;
  export function runWorkspaceTasks(
    task: (workspace: { dir: string; config: AnyJson }) => Promise<any>,
    opts?: Cwd & { spawnOpts?: SpawnOpts; filterOpts?: FilterOpts },
  ): Promise<void>;
  export function updatePackageVersions(
    updatedPackages: { [name: string]: string },
    opts?: Cwd,
  ): Promise<null>;

  /* Commands */

  export function workspacesRun(
    opts: Cwd & {
      script: string;
      scriptArgs?: string[];
      spawnOpts: SpawnOpts;
      filterOpts: FilterOpts;
    },
  ): Promise<void>;

  // TODO...

  /*~ If there are types, properties, or methods inside dotted names
   *~ of the module, declare them inside a 'namespace'.
   */
  export namespace subProp {
    /*~ For example, given this definition, someone could write:
     *~   import { subProp } from 'yourModule';
     *~   subProp.foo();
     *~ or
     *~   import * as yourMod from 'yourModule';
     *~   yourMod.subProp.foo();
     */
    export function foo(): void;
  }
}
