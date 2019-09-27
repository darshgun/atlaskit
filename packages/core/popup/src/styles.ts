import { N0, N40A } from '@atlaskit/theme/colors';
import { borderRadius, layers } from '@atlaskit/theme/constants';

const shadow = N40A;

export const popupCSS = {
  backgroundColor: N0,
  borderRadius: `${borderRadius()}px`,
  boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
  boxSizing: 'border-box',
  display: 'block',
  flex: '1 1 auto',
  overflow: 'auto',
  zIndex: layers.layer(),
  ':focus': {
    outline: 'none',
  },
} as const;

export const containerCSS = {
  position: 'relative',
} as const;
