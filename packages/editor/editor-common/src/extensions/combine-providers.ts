import { ExtensionProvider, ExtensionManifest } from './types';
import { flatten } from './helpers';

enum ResultStatus {
  fullfilled,
  failed,
}

type FullfiledResult<T> = {
  status: ResultStatus.fullfilled;
  value: T;
};

type RejectedResult = {
  status: ResultStatus.failed;
  reason: any;
};

const isFullfilled = <T>(
  result: FullfiledResult<T> | RejectedResult,
): result is FullfiledResult<T> => result.status === ResultStatus.fullfilled;

const getOnlyFullfilled = <T>(
  results: (FullfiledResult<T> | RejectedResult)[],
): T[] => results.filter(isFullfilled).map(result => result.value);

const markFullfilled = <T>(value: T): FullfiledResult<T> => ({
  status: ResultStatus.fullfilled,
  value: value,
});

const markRejected = (error: any): RejectedResult => ({
  status: ResultStatus.failed,
  reason: error,
});

/**
 * Will wait for all promises to resolve or reject, wrapping their real results in
 * object containing the status so it's easy to filter it later. Loosely inspired by
 * [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
 * which can replace this implementation once it makes to the browsers.
 * @param promises
 */
const waitForAllPromises = <T>(
  promises: Promise<T>[],
): Promise<(FullfiledResult<T> | RejectedResult)[]> => {
  return Promise.all(
    promises.map((result: Promise<T>) =>
      result.then(markFullfilled).catch(markRejected),
    ),
  );
};

/**
 * Allow to run methods from the `ExtensionProvider` interface across all providers seamlessly.
 * Handles promise racing and discards rejected promises safely.
 */
export default (
  extensionProviders: (ExtensionProvider | Promise<ExtensionProvider>)[],
): ExtensionProvider => {
  const getUnwrappedExtensionProviders = async () => {
    const results = await waitForAllPromises<ExtensionProvider>(
      extensionProviders.map(result => Promise.resolve(result)),
    );

    return getOnlyFullfilled<ExtensionProvider>(results);
  };

  const runInAllProviders = async <T>(
    mapFunction: (provider: ExtensionProvider) => Promise<T>,
  ) => {
    const results = await waitForAllPromises<T>(
      (await getUnwrappedExtensionProviders()).map(provider =>
        mapFunction(provider),
      ),
    );

    return getOnlyFullfilled<T>(results);
  };

  return {
    async getExtensions() {
      const result = await runInAllProviders<ExtensionManifest[]>(provider =>
        provider.getExtensions(),
      );
      return flatten<ExtensionManifest>(result);
    },

    async getExtension(key: string) {
      const result = await runInAllProviders<ExtensionManifest | undefined>(
        provider => provider.getExtension(key),
      );
      return result.find(extension => extension);
    },

    async search(keyword: string) {
      const result = await runInAllProviders<ExtensionManifest[]>(provider =>
        provider.search(keyword),
      );
      return flatten<ExtensionManifest>(result).filter(extension => extension);
    },
  };
};
