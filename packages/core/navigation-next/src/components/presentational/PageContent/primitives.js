// @flow

import React from 'react';
import { applyDisabledProperties } from '../../../common/helpers';
import type { Resizable } from '../LayoutManager/primitives';

type PageProps = Resizable & { leftOffset: number, topOffset: number };

export const PageWrapper = ({
  innerRef,
  disableInteraction,
  leftOffset,
  topOffset,
  ...props
}: PageProps) => (
  <div
    ref={innerRef}
    css={{
      flex: '1 1 auto',
      marginLeft: leftOffset,
      marginTop: topOffset,
      width: 0, // fix flexbox growth to available width instead of 100%
      ...applyDisabledProperties(!!disableInteraction),
    }}
    {...props}
  />
);
