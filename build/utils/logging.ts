/**
 * Logging util functions
 */

/** Monkey patches console log to output with a prefix.
 *  Returns a function that restores console.log back to the original impl
 */
export function prefixConsoleLog(prefix: string): () => void {
  const oldConsoleLog = console.log;
  console.log = (...params: any[]) => oldConsoleLog(prefix, ...params);

  return () => {
    console.log = oldConsoleLog;
  };
}
