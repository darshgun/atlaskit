import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import { skeletonCSS } from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const buttonHeight = gridSize * 4;

export const margin = {
  left: gridSize / 2,
};

export const padding = {
  all: gridSize / 2,
};

export const getPrimaryButtonTheme = ({
  mode: { primaryButton },
}: NavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
) => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      fontSize: fontSizeSmall(),
      fontWeight: 'bold',
      height: buttonHeight,
      padding: padding.all,
      ...primaryButton.default,
      ':hover': primaryButton.hover,
      ':focus': primaryButton.focus,
      ':active': primaryButton.active,
    },
    spinnerStyles,
  };
};

export const primaryButtonSkeletonCSS = (theme: NavigationTheme) => ({
  borderRadius: `${gridSize / 2}px`,
  display: 'inline-flex',
  height: `${buttonHeight - padding.all * 2.5}px`,
  width: '68px',
  ...skeletonCSS(theme),
});
