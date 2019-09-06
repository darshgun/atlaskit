import React, { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Popup from '../src';
import { Placement } from '@atlaskit/popper';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

type PopupProps = {
  loading: boolean;
  setPosition(): void;
  position: string;
  scheduleUpdate?(): void;
  setButtonWidth: any;
  buttonWidth: number;
};

type ExpanderProps = {
  width: number;
};

const Spacer = styled.div`
  margin: 250px;
`;

const SizedContent = styled.div`
  align-items: center;
  text-align: center;
  vertical-align: center;
  padding: 30px;
  max-width: 300px;
`;

const SpinnerSpacer = styled.div`
  margin: 20px;
`;

const Expander = styled.span<ExpanderProps>`
  display: inline-block;
  width: ${props => (props.width ? props.width : 0)}px;
`;

const PopupContent: FC<PopupProps> = ({
  loading,
  setPosition,
  position,
  setButtonWidth,
  buttonWidth,
}) => {
  const [content, setContent] = useState(
    'Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. ',
  );
  const addContent = () => {
    setContent(`${content}Lorem Ipsum dolor sit amet. `);
  };

  const clearContent = () => {
    setContent('');
  };

  return loading ? (
    <SpinnerSpacer>
      <Spinner size="large" />
    </SpinnerSpacer>
  ) : (
    <SizedContent>
      <Button onClick={() => setPosition()}>Toggle Position</Button>
      <p>
        Current position: <strong>{position}</strong>
      </p>
      <hr />
      <Button onClick={() => setButtonWidth(buttonWidth + 15)}>
        Expand Button
      </Button>
      <Button onClick={() => setButtonWidth(0)}>Reset Button</Button>
      <hr />
      <Button onClick={addContent}>Add Content</Button>
      <Button onClick={clearContent}>Clear Content</Button>
      <br />
      {content}
    </SizedContent>
  );
};

export default () => {
  const [idx, setIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(
    () => {
      if (isOpen) {
        window.setTimeout(() => setIsLoaded(true), 600);
      } else {
        setIsLoaded(false);
      }
    },
    [isOpen],
  );

  const positions: Placement[] = [
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
  const position = positions[idx];

  const setPosition = () => {
    if (idx !== positions.length - 1) {
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
          <PopupContent
            loading={!isLoaded}
            setPosition={setPosition}
            position={position}
            setButtonWidth={setButtonWidth}
            buttonWidth={buttonWidth}
          />
        )}
        trigger={triggerProps => (
          <Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Open'} Popup <Expander width={buttonWidth} />
          </Button>
        )}
        placement={position}
      />
    </Spacer>
  );
};
