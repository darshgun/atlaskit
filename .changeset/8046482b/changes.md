- Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided.

**Breaking**
Color palettes have been moved into their own file.

Users will need to update imports from this:

```javascript
import { colors } from '@atlaskit/theme';

colors.colorPalette('8');
```

to this:

```javascript
import { colorPalette } from '@atlaskit/theme';

colorPalette.colorPalette('8');
```

or for multi entry-point users:

```javascript
import * as colors from '@atlaskit/theme/colors';

colors.colorPalette('8');
```

to this:

```javascript
import * as colorPalettes from '@atlaskit/theme/color-palette';

colorPalettes.colorPalette('8');
```
