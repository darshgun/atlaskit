---
'@atlaskit/media-viewer': minor
---

Expose new property: components.sidebarRenderer to allow Sidebar integration

> MediaViewer will call sidebarRenderer each time a navigation happens, and will provide the selected identifier.

**New api**

The new addition has been the, components field, which looks like:

```typescript
interface MediaViewerComponents {
  sidebarRenderer?: (selectedIdentifier: Identifier) => ReactNode;
}
```

**Usage**

```typescript
import { MediaViewer } from '@atlaskit/media-viewer';
import { Identifier } from '@atlaskit/media-client';

const sidebarRenderer = (selectedIdentifier: Identifier) => {
  return <div>{selectedIdentifier.id}</div>;
};

<MediaViewer
  components={{
    sidebarRenderer,
  }}
/>;
```
