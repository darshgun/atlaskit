## Breacking change

> remove deprecated "context" property from media components in favor of "mediaClientConfig"

**Before**:

```
import {ContextFactory} from '@atlaskit/media-core';
import {Card} from '@atlaskit/media-card'

const context = ContextFactory.creat({
  authProvider: () => Promise.resolve({})
})


<Card context={context}>
```


**Now**:

```
import {MediaClientConfig} from '@atlaskit/media-core';
import {Card} from '@atlaskit/media-card'

const mediaClientConfig: MediaClientConfig = {
  authProvider: () => Promise.resolve({})
}

<Card mediaClientConfig={mediaClientConfig}>
```