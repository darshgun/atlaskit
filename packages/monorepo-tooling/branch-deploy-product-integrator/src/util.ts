/**
 * Util functions
 */
export function debugMock(
  objName: string,
): {
  [prop: string]: any;
} {
  return new Proxy(
    {},
    {
      get(target, prop: string) {
        return (...args: any[]) => {
          console.log(`Called ${objName}.${prop}(${args})`);
        };
      },
    },
  );
}
