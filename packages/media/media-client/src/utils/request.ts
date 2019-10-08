import { parse, stringify } from 'query-string';

import { Auth, isClientBasedAuth } from '@atlaskit/media-core';
import { mapAuthToQueryParameters } from '../models/auth-query-parameters';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestParams = { [key: string]: any };

export type RequestHeaders = { [key: string]: string };

export type RequestOptions = {
  readonly method?: RequestMethod;
  readonly auth?: Auth;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
};

class HttpError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const processFetchResponse = async (response: Response) => {
  if (response.ok || response.redirected) {
    return response;
  } else {
    const text = await response.text();
    throw new HttpError(
      `Got error code ${response.status}: ${text}`,
      response.status,
    );
  }
};

export function request(
  url: string,
  options: RequestOptions & { retryOptions?: Partial<RetryOptions> } = {},
  controller?: AbortController,
): Promise<Response> {
  const {
    method = 'GET',
    auth,
    params,
    headers,
    body,
    retryOptions = {},
  } = options;

  return promiseRetry(
    () =>
      fetch(createUrl(url, { params }), {
        method,
        body,
        headers: withAuth(auth)(headers),
        signal: controller && controller.signal,
      })
        .catch(async e => {
          throw e;
        })
        .then(processFetchResponse),
    {
      ...retryOptions,
      retryCondition: {
        reject: (e: Error) =>
          e instanceof TypeError || (e as HttpError).statusCode >= 500,
        resolve: (_: Response) => false,
      },
    },
  );
}

export function mapResponseToJson(response: Response): Promise<any> {
  return response.json();
}

export function mapResponseToBlob(response: Response): Promise<Blob> {
  return response.blob();
}

export function mapResponseToVoid(_response: Response): Promise<void> {
  return Promise.resolve();
}

export type CreateUrlOptions = {
  readonly params?: RequestParams;
  readonly auth?: Auth;
};

export function createUrl(
  url: string,
  { params, auth }: CreateUrlOptions,
): string {
  const { baseUrl, queryParams } = extract(url);
  const authParams = auth && mapAuthToQueryParameters(auth);
  const queryString = stringify({
    ...queryParams,
    ...params,
    ...authParams,
  });
  const shouldAppendQueryString = queryString.length > 0;

  return `${baseUrl}${shouldAppendQueryString ? `?${queryString}` : ''}`;
}

function withAuth(auth?: Auth) {
  return (headers?: RequestHeaders): RequestHeaders | undefined => {
    if (auth) {
      return {
        ...(headers || {}),
        ...mapAuthToRequestHeaders(auth),
      };
    } else {
      return headers;
    }
  };
}

function extract(url: string): { baseUrl: string; queryParams?: any } {
  const index = url.indexOf('?');

  if (index > 0) {
    return {
      baseUrl: url.substring(0, index),
      queryParams: parse(url.substring(index + 1, url.length)),
    };
  } else {
    return {
      baseUrl: url,
    };
  }
}

function mapAuthToRequestHeaders(auth: Auth): RequestHeaders {
  if (isClientBasedAuth(auth)) {
    return {
      'X-Client-Id': auth.clientId,
      Authorization: `Bearer ${auth.token}`,
    };
  } else {
    return {
      'X-Issuer': auth.asapIssuer,
      Authorization: `Bearer ${auth.token}`,
    };
  }
}

export interface RetryOptions {
  attempts: number;
  startTimeoutInMs: number;
  factor: number;
  startImmediately: boolean;
}
type RetryOptionsWithCondition<T> = RetryOptions & {
  retryCondition?: {
    resolve: (result: T) => boolean;
    reject: (err: Error) => boolean;
  };
};
type PromiseConstructor<T> = () => Promise<T>;

const DEFAULT_OPTIONS: RetryOptions = {
  attempts: 5, // Current test delay is 60s, so retries should finish before if a promise takes < 1s
  startTimeoutInMs: 1000, // 1 second is generally a good timeout to start
  factor: 2, // Good for polling, which is out main use case
  startImmediately: false, // Good when you expect results not to be immediate
};
const wait = (timeoutInMs: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeoutInMs);
  });

async function promiseRetry<T>(
  promiseConstructor: PromiseConstructor<T>,
  overwriteOptions: Partial<RetryOptionsWithCondition<T>> = {},
): Promise<T> {
  const options = {
    ...DEFAULT_OPTIONS,
    ...overwriteOptions,
  } as RetryOptionsWithCondition<T>;

  let timeoutInMs = options.startTimeoutInMs;
  let lastError: Error = new Error('Default error for retry exhaustion');
  const waitAndBumpTimeout = async () => {
    await wait(timeoutInMs);
    timeoutInMs *= options.factor;
  };
  if (!options.startImmediately) {
    await waitAndBumpTimeout();
  }

  for (let i = 1; i < options.attempts + 1; ++i) {
    try {
      const result = await promiseConstructor();
      if (!options.retryCondition || !options.retryCondition.resolve(result)) {
        return result;
      }

      lastError = new Error('Retry-on-resolve condition was met');
      await waitAndBumpTimeout();
    } catch (err) {
      if (!options.retryCondition || !options.retryCondition.reject(err)) {
        return Promise.reject<T>(
          new Error(
            `The call did not succeed after one attempt. Last error is\n---\n${
              err.stack
            }\n---`,
          ),
        );
      }

      lastError = err;
      await waitAndBumpTimeout();
    }
  }

  return Promise.reject<T>(
    new Error(
      `The call did not succeed after ${
        options.attempts
      } attempts. Last error is\n---\n${lastError.stack}\n---`,
    ),
  );
}
