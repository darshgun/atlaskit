import { DEFAULT_THEME_MODE } from '../constants';
import { Theme, ThemeProps } from '../types';

export default function getTheme(
  props: ?(ThemeProps | { theme: Theme }),
): Theme {
  if (props && props.theme && props.theme.__ATLASKIT_THEME__) {
    return props.theme.__ATLASKIT_THEME__;
  }
  if (props && props.theme && props.theme.mode) {
    return props.theme;
  }
  return {
    mode: DEFAULT_THEME_MODE,
  };
}
