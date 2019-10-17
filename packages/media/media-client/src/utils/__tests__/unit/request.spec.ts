import fetchMock from 'fetch-mock';

import { request } from '../../request';

describe('request', () => {
  const url = 'http://some-url/';
  const clientId = 'some-client-id';
  const asapIssuer = 'some-asap-issuer';
  const token = 'some-token';
  const baseUrl = 'some-base-url';

  describe('2xx codes handling', () => {
    beforeEach(() => fetchMock.mock(`*`, {}));

    afterEach(fetchMock.restore);

    it('should call fetch with GET method given url only', async () => {
      await request(url);

      expect(fetchMock.lastUrl()).toEqual(url);
      expect(fetchMock.lastOptions()).toEqual({ method: 'GET' });
    });

    it('should call fetch with auth header given GET request and client based auth', async () => {
      await request(url, {
        method: 'GET',
        auth: { clientId, token, baseUrl },
      });

      expect(fetchMock.lastUrl()).toEqual(`${url}`);
      expect(fetchMock.lastOptions()).toEqual({
        method: 'GET',
        headers: {
          Authorization: 'Bearer some-token',
          'X-Client-Id': 'some-client-id',
        },
      });
    });

    it('should call fetch with auth header given GET request and asap based auth', async () => {
      await request(url, {
        method: 'GET',
        auth: { asapIssuer, token, baseUrl },
      });

      expect(fetchMock.lastUrl()).toEqual(`${url}`);
      expect(fetchMock.lastOptions()).toEqual({
        method: 'GET',
        headers: {
          'X-Issuer': asapIssuer,
          Authorization: `Bearer ${token}`,
        },
      });
    });

    it('should call fetch with auth headers given POST request and client based auth', async () => {
      await request(url, {
        method: 'POST',
        auth: { clientId, token, baseUrl },
      });

      expect(fetchMock.lastUrl()).toEqual(`${url}`);
      expect(fetchMock.lastOptions()).toEqual({
        method: 'POST',
        headers: {
          'X-Client-Id': clientId,
          Authorization: `Bearer ${token}`,
        },
      });
    });

    it('should call fetch with auth headers given GET request and asap based auth', async () => {
      await request(url, {
        method: 'POST',
        auth: { asapIssuer, token, baseUrl },
      });

      expect(fetchMock.lastUrl()).toEqual(`${url}`);
      expect(fetchMock.lastOptions()).toEqual({
        method: 'POST',
        headers: {
          'X-Issuer': asapIssuer,
          Authorization: `Bearer ${token}`,
        },
      });
    });
  });

  describe('errors and retries handling', () => {
    afterEach(fetchMock.restore);

    it('should not fail or retry if response is 300', async () => {
      fetchMock.mock('*', {
        status: 300,
        __redirectUrl: 'http://other-url',
      });
      const response = await request(url);
      expect(response.status).toBe(200);
      // @ts-ignore: Property '_bodyText' does not exist on type 'Response'.
      expect(response._bodyText).toBe(
        '{"status":300,"__redirectUrl":"http://other-url"}',
      );
      expect(fetchMock.calls().length).toEqual(1); // meaning it didn't retry because it shouldn't retry on 4xx
    });

    it('should fail but not retry if response is 400', async () => {
      fetchMock.mock(
        url,
        {
          status: 400,
          body: 'There was a problem',
        },
        {
          name: '400',
        },
      );
      let error;

      try {
        await request(url);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(
        /The call did not succeed after one attempt.*/,
      );
      expect(fetchMock.calls().length).toEqual(1); // meaning it didn't retry because it shouldn't retry on 4xx
    });

    it('should retry on >= http 500', async () => {
      let requestCount = 0;
      fetchMock
        .get(
          // the type here should be fetchMock.MockRequest but the authors of this library forgot to export it
          (_url: string, _opts: any) => !!++requestCount && requestCount < 3,
          {
            status: 500,
          },
          { name: 'fails' },
        )
        .get(
          (_url: string, _opts: any) => requestCount === 3,
          {
            status: 200,
          },
          { name: 'succeeds' },
        );

      const response = await request(url, {
        retryOptions: { factor: 1, startTimeoutInMs: 1 },
      });

      expect(response.status).toEqual(200);
      expect(fetchMock.calls().length).toEqual(3); // shoud retry twice
    });

    it('should retry on >= http 500 and fail after a number of attempts if unsuccessful', async () => {
      fetchMock.get(url, {
        status: 500,
      });

      let error;
      try {
        await request(url, {
          retryOptions: { attempts: 2, factor: 1, startTimeoutInMs: 1 },
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(
        /The call did not succeed after 2 attempts.*/,
      );
      expect(fetchMock.calls().length).toEqual(2); // shoud retry the set number of times and fail
    });

    it('should retry on >= http 500 and fail after default number of attempts if unsuccessful', async () => {
      fetchMock.get(url, {
        status: 500,
      });

      let error;
      try {
        await request(url, {
          retryOptions: { factor: 1, startTimeoutInMs: 1 },
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(
        /The call did not succeed after 5 attempts.*/,
      );
      expect(fetchMock.calls().length).toEqual(5); // shoud retry the default number of times and fail
    });
  });
});
