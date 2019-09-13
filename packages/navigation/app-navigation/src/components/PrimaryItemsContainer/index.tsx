/** @jsx jsx */
import { jsx } from '@emotion/core';
import WidthDetector from '@atlaskit/width-detector';
import {
  useOverflowController,
  OverflowProvider,
} from '../../controllers/overflow';
import { PrimaryButton } from '../PrimaryButton';
import { containerCSS, widthDetectorContainerStyle } from './styles';
import { PrimaryItemsContainerProps } from './types';

export const PrimaryItemsContainer = ({
  moreLabel,
  items,
}: PrimaryItemsContainerProps) => {
  const { updateWidth, visibleItems, overflowItems } = useOverflowController(
    items,
  );

  return (
    <div css={containerCSS}>
      <OverflowProvider isVisible>{visibleItems}</OverflowProvider>
      {overflowItems.length > 0 && (
        <PrimaryButton
          text={moreLabel}
          dropdownContent={() => (
            <OverflowProvider isVisible={false}>
              {overflowItems}
            </OverflowProvider>
          )}
        />
      )}
      <WidthDetector
        containerStyle={widthDetectorContainerStyle}
        onResize={updateWidth}
      >
        {() => null}
      </WidthDetector>
    </div>
  );
};
