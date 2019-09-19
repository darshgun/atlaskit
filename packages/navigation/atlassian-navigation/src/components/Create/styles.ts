import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import {
  actionSectionDesktopCSS,
  actionSectionMobileCSS,
  skeletonCSS,
} from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

const buttonHeight = gridSize * 4;

export const createButtonCSS = actionSectionDesktopCSS;

export const createButtonSkeletonCSS = (theme: NavigationTheme) => ({
  height: `${buttonHeight}px`,
  width: '68px',
  borderRadius: '3px',
  ...createButtonCSS,
  ...skeletonCSS(theme),
});

export const createIconCSS = actionSectionMobileCSS;
export const createIconSkeletonCSS = createIconCSS;

export const getCreateButtonTheme = ({ mode: { create } }: NavigationTheme) => (
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
      textTransform: 'uppercase',
      ...create.default,
      ':hover': create.hover,
      ':focus': create.focus,
      ':active': create.active,
    },
    spinnerStyles,
  };
};
