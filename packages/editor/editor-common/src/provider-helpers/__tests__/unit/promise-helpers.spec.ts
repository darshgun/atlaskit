import {
  getOnlyFulfilled,
  waitForAllPromises,
  waitForFirstFulfilledPromise,
  ResultStatus,
} from '../../promise-helpers';

const resolvesIn = (timeout: number, value: any) =>
  new Promise(resolve => {
    setTimeout(() => resolve(value), timeout);
  });

const rejectsIn = (timeout: number, reason: any) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(reason), timeout);
  });

describe('promise-helpers', () => {
  describe('waitForAllPromises', () => {
    test('should return the promise, wrapped in a object containing the status, so it can be filtered later', async () => {
      const a = Promise.resolve('a');
      const b = Promise.reject('b');

      expect(await waitForAllPromises([a])).toEqual([
        { status: ResultStatus.fulfilled, value: 'a' },
      ]);

      expect(await waitForAllPromises([b])).toEqual([
        { status: ResultStatus.failed, reason: 'b' },
      ]);
    });

    test('should wait for all promises to resolve/reject before resolving itself', async () => {
      const a = resolvesIn(10, 'a');
      const b = resolvesIn(15, 'b');
      const c = rejectsIn(20, 'c');

      expect(await waitForAllPromises([a, b, c])).toEqual([
        { status: ResultStatus.fulfilled, value: 'a' },
        { status: ResultStatus.fulfilled, value: 'b' },
        { status: ResultStatus.failed, reason: 'c' },
      ]);
    });
  });

  describe('waitForFirstFulfilledPromise', () => {
    test('should return on the first fulfilled promise, disregarding rejected ones', async () => {
      const a = rejectsIn(10, 'a');
      const b = resolvesIn(15, 'b');
      const c = resolvesIn(12, 'c');

      expect(await waitForFirstFulfilledPromise([a, b, c])).toEqual('c');
    });

    test('should reject if all promises have rejected', async () => {
      const a = rejectsIn(10, 'a');
      const b = rejectsIn(15, 'b');
      const c = rejectsIn(12, 'c');

      return expect(waitForFirstFulfilledPromise([a, b, c])).rejects.toEqual(
        new Error('All promises have failed!'),
      );
    });
  });

  describe('getOnlyFulfilled', () => {
    test('should return only fulfilled results, unwrapped', async () => {
      expect(
        getOnlyFulfilled<string>([
          { status: ResultStatus.fulfilled, value: 'a' },
          { status: ResultStatus.fulfilled, value: 'b' },
          { status: ResultStatus.failed, reason: 'c' },
        ]),
      ).toEqual(['a', 'b']);
    });
  });
});
