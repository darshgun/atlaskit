/** Typescript type guards */

/* A simple defined check with type guard that works well with Array.prototype.filter */
export function isDefined<T>(arg: T | undefined | null): arg is T {
  return arg != null;
}
