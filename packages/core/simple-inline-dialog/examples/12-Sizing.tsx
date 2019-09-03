import React, { FC, useState, Fragment } from 'react';
import styled from '@emotion/styled';
import Dialog from '../src';
import Button from '@atlaskit/button';

const Spacer = styled.div`
  margin: 0px 250px 250px;
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <Spacer>
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          shouldFitContainer
          minWidth="600px"
          content={<DialogContent />}
          trigger={triggerProps => (
            <Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Close' : 'Open'} Dialog
            </Button>
          )}
          position="bottom"
        />
      </Spacer>
      <Spacer>
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          maxHeight="150px"
          content={<DialogContent />}
          trigger={triggerProps => (
            <Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Close' : 'Open'} Dialog
            </Button>
          )}
          position="bottom"
        />
      </Spacer>
    </Fragment>
  );
};
