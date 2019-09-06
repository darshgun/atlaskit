/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { HEADER_HEIGHT } from '../styled';

const HEADER_TITLE_BORDER_BOTTOM = 2;
export const HeaderContainer = styled.div`
  box-sizing: border-box;
  height: ${HEADER_HEIGHT}px;
  background-color: ${colors.N10};
  border-bottom: ${HEADER_TITLE_BORDER_BOTTOM}px solid ${colors.N30};
  justify-content: space-between;
  padding-top: ${gridSize() - HEADER_TITLE_BORDER_BOTTOM / 2}px;
  padding-bottom: ${gridSize() - HEADER_TITLE_BORDER_BOTTOM / 2}px;
`;

export const CloseButtonContainer = styled.div`
  position: absolute;
  right: ${gridSize()}px;
  top: ${gridSize()}px;
`;

export const BackButtonContainer = styled.div`
  position: absolute;
  top: ${gridSize()}px;
  left: ${gridSize()}px;
`;

export const HeaderTitle = styled.div`
  color: ${colors.N500};
  text-align: center;
  font-size: 1rem;
  height: ${gridSize() * 4}px;
  line-height: ${gridSize() * 4}px;
  width: 100%;
`;
