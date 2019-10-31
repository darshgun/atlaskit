import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { CSSObject } from '@emotion/core';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
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
      ...primaryButton.default,
      padding: 0,
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

export const isSelectedCSS = (
  { mode: { primaryButton } }: NavigationTheme,
  isSelected?: boolean,
): CSSObject => ({
  alignItems: 'center',
  borderTop: `${gridSize / 2}px solid transparent`,
  borderBottom: isSelected
    ? `${gridSize / 2}px solid ${primaryButton.selected.color}`
    : `${gridSize / 2}px solid transparent`,
  boxSizing: 'border-box',
  display: 'flex',
  height: '100%',
});
