import { createTheme } from '../utils/createTheme';

export type GlobalThemeProps = *;
export interface GlobalThemeTokens {
  mode: 'dark' | 'light',
};

export default createTheme<GlobalThemeTokens, GlobalThemeProps>(() => ({
  mode: 'light',
}));
