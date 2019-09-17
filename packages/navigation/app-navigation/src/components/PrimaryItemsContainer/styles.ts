import { gridSize } from '@atlaskit/theme/constants';
import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';

const topMarginSize = HORIZONTAL_GLOBAL_NAV_HEIGHT * 0.25;
const rightMarginSize = 0;
const bottomMarginSize = topMarginSize;
const leftMarginSize = gridSize() / 2;

export const containerCSS = {
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
  '& > *': {
    flexShrink: 0,
    margin: `${topMarginSize}px ${rightMarginSize}px ${bottomMarginSize}px ${leftMarginSize}px`,
  },
};

export const widthDetectorContainerStyle = {
  flexShrink: 1,
  minWidth: 1,
};

export const primaryButtonSkeletonCSS = {
  marginLeft: `${gridSize() * 1.5}px`,
  marginRight: `${gridSize() * 1.5}px`,
};
