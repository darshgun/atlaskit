// @flow

import { gridSize } from '@atlaskit/theme/constants';

import { N30A } from '@atlaskit/theme/colors';
import type { ModeColors } from '../../../theme/types';

const dividerLineHeight = 2;
const dividerTotalHeight = gridSize() * 5;

const baseStyles = {
  borderRadius: '1px',
  flexShrink: 0,
  height: `${dividerLineHeight}px`,
  margin: `${(dividerTotalHeight - dividerLineHeight) / 2}px 0`,
};

export default ({ product }: ModeColors) => () => ({
  container: { ...baseStyles, backgroundColor: N30A },
  product: { ...baseStyles, backgroundColor: product.background.static },
});
