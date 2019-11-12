Remove remaining color utils in editor-common in favor of adf-schema

## Summary

The color utility exports in `@atlaskit/editor-common` have been removed as they were duplicates of color utilities in `@atlaskit/adf-schema`.
This also affects the secondary `@atlaskit/editor-common/color` entrypoint, which has been removed.
Change your imports for the following functions to point to `@atlaskit/adf-schema`:

- normalizeHexColor
- hexToRgb
- hexToRgba
- rgbToHex
- isRgb
- isHex

## Example

```ts
/* replace this */
import { normalizeHexColor } from '@atlaskit/editor-common';

/* with this */
import { normalizeHexColor } from '@atlaskit/adf-schema';
```
