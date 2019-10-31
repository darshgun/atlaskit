import { B400, N0 } from '@atlaskit/theme/colors';
import { generateTheme } from './themeGenerator';
import { DEFAULT_THEME_NAME } from './defaultTheme';
import { NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
  name: DEFAULT_THEME_NAME,
  backgroundColor: N0,
  highlightColor: B400,
});

export const defaultTheme: NavigationTheme = atlassianTheme;
