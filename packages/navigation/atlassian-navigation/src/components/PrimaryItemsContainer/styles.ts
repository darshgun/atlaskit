import { gridSize } from '@atlaskit/theme/constants';

const leftMarginSize = gridSize();

export const containerCSS = {
  alignItems: 'stretch',
  display: 'flex',
  flexGrow: 1,
  flexShrink: 0,
  height: '100%',
  overflow: 'hidden',
  '& > *': {
    flexShrink: 0,
    marginLeft: leftMarginSize,
  },
  '&:first-of-type': {
    marginLeft: 0,
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
