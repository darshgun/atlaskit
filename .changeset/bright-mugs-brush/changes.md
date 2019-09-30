## Breaking change

> remove deprecated "context" property from media components in favor of "mediaClientConfig"

This affects all public media UI components:

* Card
* Filmstrip
* SmartMediaEditor
* MediaImage
* Dropzone
* Clipboard
* Browser
* MediaPicker
* MediaViewer

**Before**:

```
import {ContextFactory} from '@atlaskit/media-core';
import {Card} from '@atlaskit/media-card'
import {SmartMediaEditor} from '@atlaskit/media-editor'
import {Filmstrip} from '@atlaskit/media-filmstrip'
import {MediaImage} from '@atlaskit/media-image'
import {MediaViewer} from '@atlaskit/media-viewer'
import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';

const context = ContextFactory.creat({
  authProvider: () => Promise.resolve({})
})

const mediaPicker = MediaPicker(context);


<Card context={context}>
<SmartMediaEditor context={context}>
<Filmstrip context={context}>
<MediaImage context={context}>
<Dropzone context={context}>
<Clipboard context={context}>
<Browser context={context}>
<MediaViewer context={context}>
```


**Now**:

```
import {MediaClientConfig} from '@atlaskit/media-core';
import {Card} from '@atlaskit/media-card'
import {SmartMediaEditor} from '@atlaskit/media-editor'
import {Filmstrip} from '@atlaskit/media-filmstrip'
import {MediaImage} from '@atlaskit/media-image'
import {MediaViewer} from '@atlaskit/media-viewer'
import {Dropzone, Clipboard, Browser, MediaPicker} from '@atlaskit/media-picker';


const mediaClientConfig: MediaClientConfig = {
  authProvider: () => Promise.resolve({})
}

const mediaPicker = MediaPicker(mediaClientConfig);

<Card mediaClientConfig={mediaClientConfig}>
<SmartMediaEditor mediaClientConfig={mediaClientConfig}>
<Filmstrip mediaClientConfig={mediaClientConfig}>
<MediaImage mediaClientConfig={mediaClientConfig}>
<Dropzone mediaClientConfig={mediaClientConfig}>
<Clipboard mediaClientConfig={mediaClientConfig}>
<Browser mediaClientConfig={mediaClientConfig}>
<MediaViewer mediaClientConfig={mediaClientConfig}>
```