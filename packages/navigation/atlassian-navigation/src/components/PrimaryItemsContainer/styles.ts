import { CSSObject } from '@emotion/core';
import { gridSize } from '@atlaskit/theme/constants';
import { NavigationTheme, hexToRGBA } from '../../theme';

const margin = `0 ${gridSize() / 2}px`;

export const containerCSS = ({
  mode: { navigation },
}: NavigationTheme): CSSObject => ({
  alignItems: 'stretch',
  display: 'flex',
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  '& > *': {
    flexShrink: 0,
    margin,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: `${gridSize() * 3}px`,
    background: `linear-gradient(90deg, ${hexToRGBA(
      navigation.backgroundColor,
      0,
    )} 0%, ${hexToRGBA(navigation.backgroundColor, 0.7)} 50%, ${hexToRGBA(
      navigation.backgroundColor,
      1,
    )} 100%)`,
  },
});

export const widthDetectorContainerStyle = {
  flexShrink: 1,
  minWidth: 1,
  margin: 0,
};

export const primaryButtonSkeletonCSS = {
  marginLeft: `${gridSize() * 1.5}px`,
  marginRight: `${gridSize() * 1.5}px`,
};
