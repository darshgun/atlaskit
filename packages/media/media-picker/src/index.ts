export {
  DropzoneUploadEventPayloadMap,
  PopupUploadEventPayloadMap,
} from './components/types';

import {
  BrowserConfig,
  ClipboardConfig,
  Popup,
  PopupConfig,
  PopupConstructor,
  DropzoneConfig,
  DropzoneConstructor,
  Dropzone,
} from './components/types';

import { Context } from '@atlaskit/media-core';

export const isDropzone = (component: any): component is Dropzone =>
  component && 'activate' in component && 'deactivate' in component;
export const isPopup = (component: any): component is Popup =>
  component &&
  ['show', 'cancel', 'teardown', 'hide'].every(
    (prop: string) => prop in component,
  );

// Events public API and types
export {
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
  isImagePreview,
} from './domain/uploadEvent';

export { MediaFile } from './domain/file';
export { MediaProgress } from './domain/progress';
export { MediaError } from './domain/error';
export { ImagePreview, Preview, NonImagePreview } from './domain/preview';

// Constructor public API and types
export interface MediaPickerConstructors {
  dropzone: DropzoneConstructor;
  popup: PopupConstructor;
}

export { Dropzone, Popup };
export type MediaPickerComponent = Dropzone | Popup;

export interface MediaPickerComponents {
  dropzone: Dropzone;
  popup: Popup;
}

export { UploadParams } from './domain/config';

export { BrowserConfig, DropzoneConfig, PopupConfig, ClipboardConfig };
export interface ComponentConfigs {
  browser: BrowserConfig;
  dropzone: DropzoneConfig;
  popup: PopupConfig;
}

export { DropzoneConstructor, PopupConstructor };

export async function MediaPicker<K extends keyof MediaPickerComponents>(
  componentName: K,
  context: Context,
  pickerConfig?: ComponentConfigs[K],
): Promise<MediaPickerComponents[K]> {
  switch (componentName) {
    case 'dropzone':
      const {
        DropzoneImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-dropzone" */ './components/dropzone');
      return new DropzoneImpl(context, pickerConfig as
        | DropzoneConfig
        | undefined);
    case 'popup':
      const {
        PopupImpl,
      } = await import(/* webpackChunkName:"@atlaskit-internal_media-picker-popup" */ './components/popup');
      return new PopupImpl(context, pickerConfig as PopupConfig);
    default:
      throw new Error(`The component ${componentName} does not exist`);
  }
}

// REACT COMPONENTS

export { ClipboardLoader as Clipboard } from './components/clipboard';
export { BrowserLoader as Browser } from './components/browser';
