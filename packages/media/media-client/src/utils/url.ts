const mediaBlobUrlIdentifier = 'media-blob-url';

export const isMediaBlobUrl = (url: string): boolean => {
  return url.indexOf(`${mediaBlobUrlIdentifier}=true`) > -1;
};

export interface MediaFileAttrs {
  id: string;
  contextId: string;
  collection?: string;
  size?: number;
  name?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

const getNumberFromParam = (
  params: URLSearchParams,
  name: keyof MediaFileAttrs,
): number | undefined => {
  const value = params.get(name);

  return typeof value === 'string' && !isNaN(parseInt(value))
    ? parseInt(value)
    : undefined;
};

export const getAttrsFromUrl = (
  blobUrl: string,
): MediaFileAttrs | undefined => {
  const url = new URL(blobUrl);
  const hash = url.hash.replace('#', '');
  const params = new URLSearchParams(hash);
  const id = params.get('id');
  const contextId = params.get('contextId');
  const collection = params.get('collection');
  // check if we have the required params
  if (!id || !contextId || !collection) {
    return;
  }

  return {
    id,
    contextId,
    collection,
    height: getNumberFromParam(params, 'height'),
    width: getNumberFromParam(params, 'width'),
  };
};

export const objectToQueryString = (json: {
  [key: string]: string | number | boolean | undefined;
}): string => {
  return Object.keys(json)
    .filter(attrName => typeof json[attrName] !== 'undefined')
    .map(key => {
      const value = json[key];
      if (typeof value === 'undefined') {
        return;
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(
        value.toString(),
      )}`;
    })
    .join('&');
};

export const addFileAttrsToUrl = (
  url: string,
  fileAttrs: MediaFileAttrs,
): string => {
  const mediaIdentifierAttr = {
    [mediaBlobUrlIdentifier]: 'true',
  };
  const mergedAttrs = {
    ...mediaIdentifierAttr,
    ...fileAttrs,
  };
  const queryAttrs = objectToQueryString(mergedAttrs);

  // we can't use '?' separator for blob url params
  return `${url}#${queryAttrs}`;
};
