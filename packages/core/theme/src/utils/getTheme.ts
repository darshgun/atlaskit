import { DEFAULT_THEME_MODE } from '../constants';
import { Theme, CombinedThemeProps } from '../types';

// Resolves the different types of theme objects in the current API
export default function getTheme(props?: CombinedThemeProps): Theme {
  if (props && props.theme) {
    // Theme is the global Atlaskit theme
    if ('__ATLASKIT_THEME__' in props.theme) {
      return props.theme.__ATLASKIT_THEME__;
    }
    // User has provided alternative modes
    else if ('mode' in props.theme) {
      return props.theme;
    }
  }
  // If format not supported (or no theme provided), return standard theme
  return { mode: DEFAULT_THEME_MODE };
}
