// @flow

import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { N70 } from '@atlaskit/theme/colors';
import React from 'react';
import styled from 'styled-components';
import Btn from './Btn';

import { Heading, MonthAndYear } from '../styled/Heading';

type Props = {|
  monthLongTitle: string,
  year: number,
  handleClickNext?: () => void,
  handleClickPrev?: () => void,
|};

const ArrowLeft = styled.div`
  margin-left: 8px;
`;
const ArrowRight = styled.div`
  margin-right: 8px;
`;

export default (props: Props) => (
  <Heading aria-hidden="true">
    <ArrowLeft>
      <Btn onClick={props.handleClickPrev}>
        <ArrowleftIcon label="Last month" size="medium" primaryColor={N70} />
      </Btn>
    </ArrowLeft>
    <MonthAndYear>{`${props.monthLongTitle} ${props.year}`}</MonthAndYear>
    <ArrowRight>
      <Btn onClick={props.handleClickNext}>
        <ArrowrightIcon label="Next month" size="medium" primaryColor={N70} />
      </Btn>
    </ArrowRight>
  </Heading>
);
