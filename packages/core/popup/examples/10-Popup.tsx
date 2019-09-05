import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import Popup from '../src';
import { Placement } from '@atlaskit/popper';
import Button from '@atlaskit/button';

const Spacer = styled.div`
  margin: 250px;
`;

const SizedContent = styled.div`
  align-items: center;
  text-align: center;
  vertical-align: center;
  padding: 30px;
  height: 80px;
  overflow: auto;
`;

type PopupProps = {
  setPosition(): void;
  placement: string;
};

const PopupContent: FC<PopupProps> = ({ setPosition, placement }) => {
  return (
    <SizedContent>
      <Button onClick={() => setPosition()}>Toggle Position</Button>
      <p>
        Current placement: <strong>{placement}</strong>
      </p>
      <hr />
      <p>Scroll down.</p>
      <Button>Button 5</Button>
      <Button>Button 6</Button>
    </SizedContent>
  );
};

export default () => {
  const [idx, setIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const placements: Placement[] = [
    'bottom-start',
    'bottom',
    'bottom-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'left-start',
    'left',
    'left-end',
    'auto-start',
    'auto',
    'auto-end',
  ];
  const placement = placements[idx];

  const setPlacement = () => {
    if (idx !== placements.length - 1) {
      setIdx(idx + 1);
    } else {
      setIdx(0);
    }
  };

  return (
    <Spacer>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={() => (
          <PopupContent setPosition={setPlacement} placement={placement} />
        )}
        trigger={triggerProps => (
          <Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Open'} Popup
          </Button>
        )}
        placement={placement}
      />
    </Spacer>
  );
};
