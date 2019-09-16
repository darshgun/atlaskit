import { gridSize } from '@atlaskit/theme/constants';
import React from 'react';
import { IconButtonSkeleton } from '../IconButton/skeleton';

export const ProfileSkeleton = () => (
  <IconButtonSkeleton marginLeft={6} marginRight={6} size={gridSize() * 4.75} />
);
