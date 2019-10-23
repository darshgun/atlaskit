import { css } from 'styled-components';
import { colors } from '@atlaskit/theme';

export const placeholderStyles = css`
  .ProseMirror .placeholder-decoration {
    position: relative;
    color: ${colors.N90};
    pointer-events: none;
    display: block;

    > span {
      position: absolute;
      pointer-events: none;
    }
  }
`;
