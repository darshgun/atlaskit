import styled from 'styled-components';
import { typography, fontSize, colors } from '@atlaskit/theme';

import gridSizeTimes from '../../util/gridSizeTimes';

const baseHeading = (size: number, lineHeight: number) => `
  font-size: ${size / fontSize()}em;
  font-style: inherit;
  line-height: ${lineHeight / size};
`;

export const UserInfoOuter = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${gridSizeTimes(2)}px;
`;

export const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSizeTimes(2.5)}px;
  margin-right: ${gridSizeTimes(1)}px;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSizeTimes(0.5)}px;
`;

export const UserName = styled.span`
  ${typography.h500};
  margin-top: 0;
`;

export const UserEmail = styled.span`
  ${baseHeading(11, 16)} color: ${colors.subtleHeading};
  font-weight: 300;
  margin-top: ${gridSizeTimes(0.5)}px;
`;
