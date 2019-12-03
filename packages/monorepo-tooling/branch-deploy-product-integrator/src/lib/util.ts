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

export class ValidationError extends Error {}

export type Default<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
