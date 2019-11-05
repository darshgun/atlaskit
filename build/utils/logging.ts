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

/**
 * Creates an object spy that logs out the method and args of any method called on it
 */
export function createSpyObject<
  T = {
    [prop: string]: any;
  }
>(objName: string): T {
  return new Proxy(
    {},
    {
      get(target: any, prop: string) {
        return (...args: any[]) => {
          console.log(`Called ${objName}.${prop}(${args})`);
        };
      },
    },
  );
}
