import React, { Fragment } from 'react';
import styled from 'styled-components';
import SectionMessage from '../src';

const Padding = styled.div`
  padding: 8px;
`;

const Example = () => (
  <Fragment>
    <Padding>
      <SectionMessage
        appearance="info"
        title="More"
        testId="info-section-message"
      >
        <p>I count the steps from one end of my island to the other</p>
        <p>It{"'"}s a hundred steps from where I sleep to the sea</p>
      </SectionMessage>
    </Padding>
    <Padding>
      <SectionMessage appearance="error" testId="error-section-message">
        <p>I know where I am from the scent of the breeze</p>
        <p>The ascent of the climb</p>
        <p>From the tangle of the trees</p>
      </SectionMessage>
    </Padding>
  </Fragment>
);

export default Example;
