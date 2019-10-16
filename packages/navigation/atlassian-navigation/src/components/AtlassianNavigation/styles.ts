import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const containerCSS = ({ mode: { navigation } }: NavigationTheme) => ({
  alignItems: 'center',
  boxSizing: 'border-box' as const,
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'space-between',
  paddingLeft: gridSize * 2,
  paddingRight: gridSize * 2,
  height: HORIZONTAL_GLOBAL_NAV_HEIGHT,
  position: 'relative',
  ...bottomShadow,
  ...navigation,
});

export const leftCSS = {
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  height: 'inherit',
};

export const rightCSS = {
  alignItems: 'center',
  display: 'flex',
  flexShrink: 0,
  right: gridSize * 4,
};

export const bottomShadow = {
  '&::after': {
    content: '""',
    position:' absolute',
    left: 0,
    right: 0,
    top: '100%',
    height: '4px',
    background:'linear-gradient(180deg, #091E42 -333.33%, rgba(9, 30, 66, 0.55) -201.3%, rgba(9, 30, 66, 0.17) -99.01%, rgba(9, 30, 66, 0) 100%)',
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(9, 30, 66, 0.06)',
  }
}
