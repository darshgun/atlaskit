import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { skeletonCSS } from '../../common/styles';
import { AppNavigationTheme } from '../../theme';
import { IconButtonSkeletonProps } from './types';

const gridSize = gridSizeFn();

export const margin = {
  left: gridSize / 2,
};

export const padding = {
  all: gridSize / 2,
};

export const getIconButtonTheme = ({
  mode: { iconButton },
}: AppNavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      display: 'flex',
      height: 'auto',
      marginLeft: margin.left,
      padding: padding.all,
      ...iconButton.default,
      ':hover': iconButton.hover,
      ':focus': iconButton.focus,
      ':active': iconButton.active,
    },
    spinnerStyles,
  };
};

const buttonHeight = gridSize * 4;

export const iconButtonSkeletonCSS = (
  theme: AppNavigationTheme,
  { marginLeft, marginRight, size }: IconButtonSkeletonProps,
) => ({
  borderRadius: '50%',
  marginLeft: typeof marginLeft === 'number' ? marginLeft : `${margin.left}px`,
  marginRight: typeof marginRight === 'number' ? marginRight : 0,
  width: typeof size === 'number' ? size : `${buttonHeight}px}`,
  height: typeof size === 'number' ? size : `${buttonHeight}px`,
  ...skeletonCSS(theme),
});
