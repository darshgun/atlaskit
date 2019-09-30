## Breaking change

> remove Context related method and types from public api in favour of mediaClientConfig

### Removed

```
* WithContextOrMediaClientConfig
* WithContextOrMediaClientConfigProps
```

### Added

```
* WithMediaClientConfig
* WithMediaClientConfigProps
```

### Changed

**getMediaClient**

* Before

> works with passing either mediaClientConfig or context
```
import {getMediaClient} from '@atlaskit/media-client'

const mediaClientFromMediaClientConfig = getMediaClient({
  mediaClientConfig: {
    authProvider: () => Promise.resolve()
  }
})

const mediaClientFromContext = getMediaClient({
  context: {
    authProvider: () => Promise.resolve()
  }
})
```

* Now

> only accepts mediaClientConfig as the only param

```
import {getMediaClient} from '@atlaskit/media-client'

const mediaClient = getMediaClient({
  authProvider: () => Promise.resolve()
})
```