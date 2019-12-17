/** @jsx jsx */
import { jsx } from '@emotion/core';
import Popup from '@atlaskit/popup';
import { TriggerProps } from '@atlaskit/popup/types';
import WidthDetector from '@atlaskit/width-detector';
import { useCallback, useState } from 'react';

import {
  useOverflowController,
  OverflowProvider,
} from '../../controllers/overflow';
import { PrimaryDropdownButton } from '../PrimaryDropdownButton';

import { containerCSS, widthDetectorContainerStyle } from './styles';
import { PrimaryItemsContainerProps } from './types';
import { NavigationTheme } from '../../theme';

export const PrimaryItemsContainer = ({
  moreLabel,
  items,
  create: Create,
  theme,
}: PrimaryItemsContainerProps & { theme: NavigationTheme }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { updateWidth, visibleItems, overflowItems } = useOverflowController(
    items,
  );

  const content = useCallback(
    () => (
      <OverflowProvider isVisible={false}>{overflowItems}</OverflowProvider>
    ),
    [overflowItems],
  );

  const onMoreClick = useCallback(() => {
    setIsMoreOpen(!isMoreOpen);
  }, [isMoreOpen, setIsMoreOpen]);

  const onMoreClose = useCallback(() => {
    setIsMoreOpen(false);
  }, [setIsMoreOpen]);

  const trigger = useCallback(
    (triggerProps: TriggerProps) => (
      <PrimaryDropdownButton
        onClick={onMoreClick}
        isSelected={isMoreOpen}
        {...triggerProps}
      >
        {moreLabel}
      </PrimaryDropdownButton>
    ),
    [moreLabel, onMoreClick, isMoreOpen],
  );

  return (
    <div css={containerCSS(theme)}>
      <OverflowProvider isVisible>{visibleItems}</OverflowProvider>
      {overflowItems.length > 0 && (
        <Popup
          content={content}
          isOpen={isMoreOpen}
          onClose={onMoreClose}
          trigger={trigger}
        />
      )}
      {Create && <Create />}
      <WidthDetector
        containerStyle={widthDetectorContainerStyle}
        onResize={updateWidth}
      >
        {() => null}
      </WidthDetector>
    </div>
  );
};
