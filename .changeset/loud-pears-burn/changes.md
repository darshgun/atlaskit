BREAKING: remove viewContext and uploadContext from Editor mediaProvider api

A few months ago we introduced the ability to pass either `viewContext` `uploadContext` or `viewMediaClientConfig` `uploadMediaClientConfig`, in order to help with the transition of media-client > media-core.

Now we are getting rid of the old `viewContext` + `uploadContext` and just keep `viewMediaClientConfig` + `uploadMediaClientConfig`.

### Before

```typescript
import {Editor} from '@atlaskit/editor-core`
import {ContextFactory} from '@atlaskit/media-core'

const mediaProvider = Promise.resolve({
  viewContext: ContextFactory.create({
    authProvider: () => Promise.resolve()
  }),
  uploadContext: ContextFactory.create({
    authProvider: () => Promise.resolve()
  }),
})

<Editor
  mediaProvider={mediaProvider}
/>

```

### Now

```typescript
import {Editor} from '@atlaskit/editor-core`

const mediaProvider = Promise.resolve({
  viewMediaClientConfig: {
    authProvider: () => Promise.resolve()
  },
  uploadMediaClientConfig: {
    authProvider: () => Promise.resolve()
  }
})

<Editor
  mediaProvider={mediaProvider}
/>

```
