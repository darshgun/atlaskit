import { getOnlyFulfilled, waitForAllPromises } from './promise-helpers';

const flatten = <T>(arr: T[][]): T[] => ([] as any).concat(...arr);

/**
 * Allow to run methods from the given provider interface across all providers seamlessly.
 * Handles promise racing and discards rejected promises safely.
 */
export default <P>(providers: (P | Promise<P>)[]) => {
  if (providers.length === 0) {
    throw new Error('At least one provider must be provided');
  }

  const getUnwrappedProviders = async () => {
    const results = await waitForAllPromises<P>(
      providers.map(result => Promise.resolve(result)),
    );

    return getOnlyFulfilled<P>(results);
  };

  const runInAllProviders = async <T>(
    mapFunction: (provider: P) => Promise<T>,
  ) => {
    const results = await waitForAllPromises<T>(
      (await getUnwrappedProviders()).map(provider => mapFunction(provider)),
    );

    return getOnlyFulfilled<T>(results);
  };

  /**
   * Run a method from the provider or throw if not found
   * @param methodName
   * @param args
   */
  const invoke = async <T>(methodName: keyof P, args?: any[]) => {
    return await runInAllProviders<T>(provider => {
      const method = provider[methodName];

      if (typeof method === 'function') {
        return method.apply(provider, args);
      }

      throw new Error(`"${methodName}" isn't a function of the provider`);
    });
  };

  /**
   * Run a method from the provider which expects to return a single item
   * @param methodName
   * @param args
   */
  const invokeSingle = async <T>(methodName: keyof P, args?: any[]) => {
    const results = await invoke<T>(methodName, args);

    return results.find(extension => extension);
  };

  /**
   * Run a method in the provider which expectes to return a list of items
   * @param methodName
   * @param args
   */
  const invokeList = async <T>(methodName: keyof P, args?: any[]) => {
    const results = await invoke<T[]>(methodName, args);

    return flatten<T>(results).filter(result => result);
  };

  return {
    invokeSingle,
    invokeList,
  };
};
