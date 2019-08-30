import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import Dialog from '../src';
import { Placement } from '@atlaskit/popper';
import Button from '@atlaskit/button';

const Spacer = styled.div`
  margin: 150px 250px;
`;

const SizedContent = styled.div`
  align-items: center;
  text-align: center;
  vertical-align: center;
  padding: 30px;
  overflow: auto;
`;

type DialogProps = {
  setPosition(): void;
  position: string;
};

const DialogContent: FC<DialogProps> = ({ setPosition, position }) => {
  return (
    <SizedContent>
      <Button onClick={() => setPosition()}>Toggle Position</Button>
      <p>
        Current position: <strong>{position}</strong>
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
  const positions: Array<Placement> = [
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
  const setPosition = () => {
    if (idx !== positions.length - 1) {
      setIdx(idx + 1);
    } else {
      setIdx(0);
    }
  };

  const position = positions[idx];

  return (
    <Spacer>
      <Dialog
        trigger="Test"
        content={
          <DialogContent setPosition={setPosition} position={position} />
        }
        position={position}
      />
    </Spacer>
  );
};
