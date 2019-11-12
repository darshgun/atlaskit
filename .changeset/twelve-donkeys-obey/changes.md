# Move public types to media-picker/types entry point

We moved all the public types/interfaces into a new entry point **@atlaskit/media-picker/types**.
This is a breaking change only if you are using Typescript in your project. To update:

## Before

```typescript
import {
  PopupUploadEventPayloadMap,
  BrowserConfig,
  ClipboardConfig,
  DropzoneConfig,
  Popup,
  PopupConfig,
  PopupConstructor,
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
  isImagePreview,
  MediaFile,
  MediaProgress,
  MediaError,
  ImagePreview,
  Preview,
  NonImagePreview,
  Popup,
  UploadParams,
  BrowserConfig,
  PopupConfig,
  ClipboardConfig,
  DropzoneConfig,
  PopupConstructor,
} from '@atlaskit/media-picker';
```

## After

```typescript
import {
  PopupUploadEventPayloadMap,
  BrowserConfig,
  ClipboardConfig,
  DropzoneConfig,
  Popup,
  PopupConfig,
  PopupConstructor,
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
  isImagePreview,
  MediaFile,
  MediaProgress,
  MediaError,
  ImagePreview,
  Preview,
  NonImagePreview,
  Popup,
  UploadParams,
  BrowserConfig,
  PopupConfig,
  ClipboardConfig,
  DropzoneConfig,
  PopupConstructor,
} from '@atlaskit/media-picker/types';
```
