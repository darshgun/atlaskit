import { B400, N0, N600 } from '@atlaskit/theme/colors';
import { generateTheme } from './themeGenerator';
import { NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
  name: 'atlassian',
  primary: {
    backgroundColor: N0,
    color: N600 ,
  },
  secondary: {
    backgroundColor: B400,
    color: N0,
  },
});

export const defaultTheme: NavigationTheme = atlassianTheme;
