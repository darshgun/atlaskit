---
'@atlaskit/media-viewer': minor
---

Expose new property: extensions.sidebar.renderer to allow Sidebar integration

> MediaViewer will call sidebarRenderer each time a navigation happens, and will provide the selected identifier.

**New api**

The new addition has been the, extensions field, which looks like:

```typescript
interface MediaViewerExtensions {
  sidebar?: {
    icon: ReactNode;
    renderer: (selectedIdentifier: Identifier) => ReactNode;
  };
}
```

**Usage**

```typescript
import { MediaViewer } from '@atlaskit/media-viewer';
import { Identifier } from '@atlaskit/media-client';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';

const sidebarRenderer = (selectedIdentifier: Identifier) => {
  return <div>{selectedIdentifier.id}</div>;
};

<MediaViewer
  extensions={{
    sidebar: {
      icon: <EditorPanelIcon />,
      renderer: sidebarRenderer,
    },
  }}
/>;
```
