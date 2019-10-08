import { MediaPluginState, MediaNodeWithPosHandler } from '../pm-plugins/main';
import { MediaAttributes } from '@atlaskit/adf-schema';

export const findMediaSingleNode = (
  mediaPluginState: MediaPluginState,
  id: string,
): MediaNodeWithPosHandler | null => {
  const { mediaNodes } = mediaPluginState;

  // Array#find... no IE support
  return mediaNodes.reduce(
    (
      memo: MediaNodeWithPosHandler | null,
      nodeWithPos: MediaNodeWithPosHandler,
    ) => {
      if (memo) {
        return memo;
      }

      const { node } = nodeWithPos;
      if (node.attrs.id === id) {
        return nodeWithPos;
      }

      return memo;
    },
    null,
  );
};

export const findAllMediaSingleNodes = (
  mediaPluginState: MediaPluginState,
  id: string,
): MediaNodeWithPosHandler[] => {
  const { mediaNodes } = mediaPluginState;

  return mediaNodes.filter(
    nodeWithHandler =>
      (nodeWithHandler.node.attrs as MediaAttributes).id === id,
  );
};

export const findMediaNode = (
  mediaPluginState: MediaPluginState,
  id: string,
  isMediaSingle: boolean,
): MediaNodeWithPosHandler | null => {
  const mediaNodeWithPos = isMediaSingle
    ? findMediaSingleNode(mediaPluginState, id)
    : mediaPluginState.mediaGroupNodes[id];
  return mediaNodeWithPos;
};

export const isMobileUploadCompleted = (
  mediaPluginState: MediaPluginState,
  mediaId: string,
) =>
  mediaPluginState.mediaPluginOptions &&
  // This flag tells us that it's a 'mobile' env.
  mediaPluginState.mediaPluginOptions.allowMarkingUploadsAsIncomplete &&
  typeof mediaPluginState.mobileUploadComplete[mediaId] === 'boolean'
    ? mediaPluginState.mobileUploadComplete[mediaId]
    : undefined;
