import { gridSize } from '@atlaskit/theme/constants';

const margin = `0 ${gridSize() / 2}px`;

export const containerCSS = {
  alignItems: 'stretch',
  display: 'flex',
  flexGrow: 1,
  flexShrink: 0,
  height: '100%',
  overflow: 'hidden',
  '& > *': {
    flexShrink: 0,
    margin,
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
