enum ResultStatus {
  fulfilled,
  failed,
}

type FulfiledResult<T> = {
  status: ResultStatus.fulfilled;
  value: T;
};

type RejectedResult = {
  status: ResultStatus.failed;
  reason: any;
};

const isFullfilled = <T>(
  result: FulfiledResult<T> | RejectedResult,
): result is FulfiledResult<T> => result.status === ResultStatus.fulfilled;

const markFullfilled = <T>(value: T): FulfiledResult<T> => ({
  status: ResultStatus.fulfilled,
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
export const waitForAllPromises = <T>(
  promises: Promise<T>[],
): Promise<(FulfiledResult<T> | RejectedResult)[]> => {
  return Promise.all(
    promises.map((result: Promise<T>) =>
      result.then(markFullfilled).catch(markRejected),
    ),
  );
};

/**
 * Find all fullfilled promises and return their values
 * @param results
 */
export const getOnlyFulfilled = <T>(
  results: (FulfiledResult<T> | RejectedResult)[],
): T[] => results.filter(isFullfilled).map(result => result.value);
