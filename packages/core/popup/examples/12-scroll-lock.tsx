import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import Popup from '../src';
import Button from '@atlaskit/button';

const Spacer = styled.div`
  margin: 250px;
  min-width: 2000px;
  min-height: 2000px;
`;

const Container = styled.div`
  border: 3px dotted black;
  width: 300px;
  height: 300px;
  overflow: auto;
`;

const SizedContent = styled.div`
  align-items: center;
  text-align: center;
  vertical-align: center;
  padding: 30px;
`;

const PopupContent: FC = () => {
  return (
    <SizedContent>
      <h1>Scroll Lock</h1>
      <hr />
      <p>
        While this Popup is open you can't scroll the &lt;body&gt; horizontally
        or vertically.
      </p>
      <p>Elements with overflow however can still be scrolled</p>
    </SizedContent>
  );
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <h1>Try scrolling in any direction!</h1>
      <Spacer>
        <Container>
          <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            content={() => <PopupContent />}
            trigger={triggerProps => (
              <Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close' : 'Open'} Popup
              </Button>
            )}
            placement="bottom"
            lockBodyScroll
          />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </Container>
      </Spacer>
    </div>
  );
};
