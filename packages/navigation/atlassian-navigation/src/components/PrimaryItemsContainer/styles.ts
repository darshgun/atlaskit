import { gridSize } from '@atlaskit/theme/constants';
import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '../../common/constants';

const topMarginSize = 0;
const rightMarginSize = 0;
const bottomMarginSize = 0;
const leftMarginSize = gridSize() / 2;

export const containerCSS = {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
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
