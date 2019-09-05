/** @jsx jsx */
import { jsx } from '@emotion/core';
import WidthDetector from '@atlaskit/width-detector';
import {
  useOverflowController,
  OverflowProvider,
} from '../../controllers/overflow';
import getStyles from './styles';
import { PrimaryItemsContainerProps } from './types';
import { ThemedPrimaryButton } from '../PrimaryButton';

const styles = getStyles();

export const PrimaryItemsContainer = ({
  moreLabel,
  items,
}: PrimaryItemsContainerProps) => {
  const { updateWidth, visibleItems, overflowItems } = useOverflowController(
    items,
  );

  return (
    <div css={styles.outer}>
      <OverflowProvider isVisible>{visibleItems}</OverflowProvider>
      {overflowItems.length > 0 && (
        <ThemedPrimaryButton
          text={moreLabel}
          dropdownContent={() => (
            <OverflowProvider isVisible={false}>
              {overflowItems}
            </OverflowProvider>
          )}
        />
      )}
      <WidthDetector
        containerStyle={{ minWidth: 1, flexShrink: 1 }}
        onResize={updateWidth}
      >
        {() => null}
      </WidthDetector>
    </div>
  );
};
