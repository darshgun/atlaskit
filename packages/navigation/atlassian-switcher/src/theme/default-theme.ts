import { gridSize, createTheme } from '@atlaskit/theme';
import * as colors from '@atlaskit/theme/colors';
import { ThemeProps, ThemeTokens } from './types';

const defaultItemTheme = (props: ThemeProps) => {
  const gridSizeResult = gridSize();
  return {
    display: 'block',
    padding: {
      default: {
        bottom: gridSizeResult,
        top: gridSizeResult,
        left: gridSizeResult,
        right: gridSizeResult,
      },
    },
    hover: {
      background: colors.N30,
    },
    default: {
      background: 'transparent',
      text: colors.text,
      secondaryText: colors.N200,
    },
    active: {
      background: 'transparent',
    },
    width: {
      default: '100%',
    },
  };
};

const defaultChildItemTheme = (props: ThemeProps) => {
  const defaultItemThemeResult = defaultItemTheme(props);
  const gridSizeResult = gridSize();
  return {
    padding: {
      default: {
        left: gridSizeResult,
        right: gridSizeResult,
        bottom: gridSizeResult / 2,
        top: gridSizeResult / 2,
      },
    },
    hover: {
      background: colors.N30,
    },
    active: {
      background: 'transparent',
    },
    default: {
      ...defaultItemThemeResult.default,
      text: colors.N700,
    },
  };
};

export const ItemTheme = createTheme<ThemeTokens, ThemeProps>(defaultItemTheme);
export const ChildItemTheme = createTheme<ThemeTokens, ThemeProps>(
  defaultChildItemTheme,
);
