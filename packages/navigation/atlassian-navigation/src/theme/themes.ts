import { B200, B500, N0, N600 } from '@atlaskit/theme/colors';
import { generateTheme } from './themeGenerator';
import { NavigationTheme } from './types';

export const atlassianTheme: NavigationTheme = generateTheme({
  name: 'atlassian',
  primary: {
    backgroundColor: N0,
    color: N600 ,
  },
  secondary: {
    backgroundColor: '#0052CC',
    color: N0,
  },
});

export const defaultTheme: NavigationTheme = atlassianTheme;
