import { Product } from '../types';

export enum Environment {
  Staging = 'stg',
  Production = 'prod',
}

/**
 * Resolves product environment type,
 * Falls back to Environment.Staging
 *
 * !!! Trello only, other products to be added
 *
 * @param origin
 */
export const getEnvName = (origin: string = window.location.origin) =>
  ['https://trello.com'].includes(origin)
    ? Environment.Production
    : Environment.Staging;

export const getLoginUrl = (
  product: Product,
  env: Environment = getEnvName(),
  continueUrl: string = String(window.location),
) => {
  const baseUrl =
    env === Environment.Production
      ? 'https://id.atlassian.com/login'
      : 'https://id.stg.internal.atlassian.com/login';

  return `${baseUrl}?continue=${encodeURIComponent(
    continueUrl,
  )}&application=${product}`;
};
