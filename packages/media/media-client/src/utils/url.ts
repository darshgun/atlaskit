export const isMediaBlobUrl = (url: string): boolean => {
  return url.indexOf('media-blob-url=true') > -1;
};

export interface MediaBlobUrlAttrs {
  id: string;
  contextId: string;
  collection?: string;
}

export interface FileAttrs {
  id: string;
  size?: number;
  name?: string;
  mimeType?: string;
  collection?: string;
  contextId?: string;
  width?: number;
  height?: number;
}

// TODO: return missing attrs (width, height)
export const getAttrsFromUrl = (
  blobUrl: string,
): MediaBlobUrlAttrs | undefined => {
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
  };
};

// TODO: we might need to encode url values
export const addFileAttrsToUrl = (
  url: string,
  fileAttrs: FileAttrs,
): string => {
  const mediaIdentifierAttr = {
    'media-blob-url': 'true',
  };
  const mergedAttrs: { [key: string]: string | number | undefined } = {
    ...mediaIdentifierAttr,
    ...fileAttrs,
  };
  const queryAttrs = Object.keys(mergedAttrs)
    .map(attrName => {
      const value = mergedAttrs[attrName];
      return value ? `${attrName}=${value}` : undefined;
    })
    .filter(attr => !!attr)
    .join('&');

  // we can't use '?' separator for blob url params
  return `${url}#${queryAttrs}`;
};
