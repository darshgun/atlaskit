import URL from 'url-parse';
import { Location } from '../../../common/types';

export const isAbsolutePath = (path: string | Location): boolean => {
  if (typeof path !== 'string') {
    return false;
  }

  const regex = new RegExp('^([a-z]+://|//)', 'i');

  return regex.test(path);
};

export const isExternalAbsolutePath = (path: string | Location): boolean => {
  if (typeof path !== 'string' || !isAbsolutePath(path)) {
    return false;
  }

  const pathHostname = new URL(path).hostname;
  const currentHostname = new URL(window.location.href).hostname;

  return pathHostname !== currentHostname;
};

export const getRelativePath = (path: string | Location): string => {
  if (typeof path !== 'string') {
    return path.pathname ? path.pathname : '';
  }

  if (!isAbsolutePath(path)) {
    return path;
  }

  const url = new URL(path);

  return `${url.pathname}${url.query}${url.hash}`;
};
