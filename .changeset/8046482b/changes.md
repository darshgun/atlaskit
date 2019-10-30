Theme has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided.

### Breaking

** getTokens props changes **
When defining the value function passed into a ThemeProvider, the getTokens parameter cannot be called without props; if no props are provided an empty object `{}` must be passed in:

```javascript
<CustomTheme.Provider
  value={t => ({ ...t(), backgroundColor: '#333'})}
>
```

becomes:

```javascript
<CustomTheme.Provider
  value={t => ({ ...t({}), backgroundColor: '#333'})}
>
```

** Color pallets changes **
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
