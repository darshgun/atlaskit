import React, { FC } from 'react';
import styled from '@emotion/styled';
import Dialog from '../src';
import Button from '@atlaskit/button';

const Spacer = styled.div`
  margin: 150px 250px;
`;

const SizedContent = styled.div`
  align-items: center;
  text-align: center;
  vertical-align: center;
  padding: 30px;
`;

const DialogContent: FC = () => {
  return (
    <SizedContent>
      <p>Some Content</p>
      <hr />
      <p>
        Lorem ipsum dolor sit amet, <br />
        consectetur adipiscing elit, sed do eiusmod <br />
        tempor incididunt ut labore et dolore magna aliqua.
        <br />
        consectetur adipiscing elit, sed do eiusmod <br />
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <Button>Button 5</Button>
      <Button>Button 6</Button>
    </SizedContent>
  );
};

export default () => {
  return (
    <div>
      <Spacer>
        <Dialog
          trigger="Fitted Content"
          shouldFitContainer
          minWidth="600px"
          content={<DialogContent />}
          position="auto"
        />
      </Spacer>

      <Spacer>
        <Dialog
          trigger="Un-Fitted Content with scroll"
          minWidth="600px"
          maxHeight="150px"
          content={<DialogContent />}
          position="auto"
        />
      </Spacer>
    </div>
  );
};
