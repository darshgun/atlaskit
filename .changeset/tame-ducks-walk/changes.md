## Remove all interfaces and utils not related with auth or cache


### Removes

* Context / ContextFactory / ContextConfig
* MediaItemType / FileItem / FileProcessingStatus / MediaArtifact / Artifacts / FileDetails / FileFetcher / FileFetcherImpl
* UploadableFile / UploadFileCallbacks / UploadFileResult / UploadController / MediaType / isPreviewableType / TouchFileDescriptor / MediaFileArtifacts
* isImageRemote
* FileStatus / FilePreview / PreviewOptions / GetFileOptions / UploadingFileState / ProcessingFileState / ProcessedFileState / ProcessingFailedState / ErrorFileState / isErrorFileState / isImageRepresentationReady / mapMediaFileToFileState / mapMediaItemToFileState
* getMediaTypeFromMimeType
* FileState / StreamsCache
* getFileStreamsCache
* ImageResizeMode
* Identifier / FileIdentifier / ExternalImageIdentifier / isFileIdentifier / isExternalImageIdentifier / isDifferentIdentifier
* remove `cacheSize` from `ContextConfig` \ `MediaClientConfig`: This was used internally only by other media components and doesn't affect integrators

### Upgrading

Previously integrators were able to import any of the above interfaces from `@atlaskit/media-core` or from `@atlaskit/media-client`, now, it's only possible to import them from `@atlaskit/media-client`:

**before**

```
import {MediaItemType, FileItem, FileProcessingStatus} from '@atlaskit/media-core'
```

**after**

```
import {MediaItemType, FileItem, FileProcessingStatus} from '@atlaskit/media-client'
```

Also, `Context, ContextFactory, ContextConfig` has been removed completely, in order to make your components work with media now you have to:


**before**


```
import {Context, ContextFactory, ContextConfig} from '@atlaskit/media-core'

const config: ContextConfig = {
  authProvider: () => Promise.resolve({})
}

const context: Context = ContextFactory.create(config)
```


**after**


```
import {MediaClientConfig} from '@atlaskit/media-core'

const config: MediaClientConfig = {
  authProvider: () => Promise.resolve({})
}
```