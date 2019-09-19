import { B200, B500, N0 } from '@atlaskit/theme/colors';
import { generateTheme } from './themeGenerator';
import { NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
  name: 'atlassian',
  primary: {
    backgroundColor: B500,
    color: N0,
  },
  secondary: {
    backgroundColor: B200,
    color: N0,
  },
});

export const defaultTheme: NavigationTheme = atlassianTheme;
