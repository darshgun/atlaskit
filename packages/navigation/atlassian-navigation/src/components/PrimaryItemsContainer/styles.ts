import { gridSize } from '@atlaskit/theme/constants';

const leftMarginSize = gridSize() / 2;

export const containerCSS = {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  overflow: 'hidden',
  '& > *': {
    flexShrink: 0,
    marginLeft: leftMarginSize,
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
