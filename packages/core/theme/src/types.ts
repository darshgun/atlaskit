// Non-deprecated types
export type colorPaletteType = '8' | '16' | '24';
export type Elevation = 'e100' | 'e200' | 'e300' | 'e400' | 'e500';

// Deprecated / legacy types
export type ThemeModes = 'light' | 'dark';
export interface Theme {
  mode: ThemeModes;
}
export interface GlobalThemeTokens extends Theme {}
export interface ThemeProps {
  theme?: { __ATLASKIT_THEME__: Theme };
  [key: string]: any; //TODO look into this
}
export type ThemedValue<V = string | number> = (props?: ThemeProps) => V;
