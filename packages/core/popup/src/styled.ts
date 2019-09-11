import styled from '@emotion/styled';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { N0, N40A } from '@atlaskit/theme/colors';

const shadow = N40A;

export const StyledPopup = styled.div`
  background-color: ${N0};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  z-index: ${layers.layer()};
  box-sizing: border-box;
  overflow: auto;
  display: block;
  :focus {
    outline: none;
  }
  flex: 1 1 auto;
`;

export const PopupRelContainer = styled.div`
  position: relative;
`;
