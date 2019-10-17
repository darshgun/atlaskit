// Add some missing 24.x jest types since we haven't upgraded to @types/jest@24 yet
// See https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare namespace jest {
  interface DoneCallback {
    (...args: any[]): any;
    fail(error?: string | { message: string }): any;
  }

  type ProvidesCallback = (cb: DoneCallback) => any;

  interface It {
    (name: string, fn?: ProvidesCallback, timeout?: number): void;
    todo: It;
  }
}
