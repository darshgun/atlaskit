import { DEFAULT_THEME_MODE } from '../constants';
import { Theme, ThemeProps } from '../types';

type Props = { theme: Theme } | ThemeProps;

export default function getTheme(props?: Props): Theme {
  if (!props || !props.theme) {
    return {
      mode: DEFAULT_THEME_MODE,
    };
  }

  if ('__ATLASKIT_THEME__' in props.theme) {
    return props.theme.__ATLASKIT_THEME__;
  }

  return props.theme;
}
