import { B400, N0, N600 } from '@atlaskit/theme/colors';
import { generateThemes } from './themeGenerator';
import { DEFAULT_THEME_NAME } from './defaultTheme';
import { NavigationTheme } from './types';

// export const atlassianTheme: NavigationTheme = generateTheme({
//   name: DEFAULT_THEME_NAME,
//   primary: {
//     backgroundColor: N0,
//     color: N600,
//   },
//   secondary: {
//     backgroundColor: B400,
//     color: N0,
//   },
// });

export const atlassianTheme: NavigationTheme = generateThemes({
  name: DEFAULT_THEME_NAME,
  backgroundColor: N0,
  highlightColor: B400,
});

export const defaultTheme: NavigationTheme = atlassianTheme;
