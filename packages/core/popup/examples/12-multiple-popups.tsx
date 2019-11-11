/** @jsx jsx */
import { Component, FC, useCallback, useState } from 'react';
import Button from '@atlaskit/button';
import { jsx } from '@emotion/core';
import Popup, { ContentProps } from '../src';

const contentCSS = {
  margin: '1rem',
};

class PopupContent extends Component<ContentProps> {
  render() {
    return <div css={contentCSS}>content</div>;
  }
}

type PopupExampleProps = {
  name: string;
};

const PopupExample: FC<PopupExampleProps> = ({ name }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = useCallback(() => {
    console.log('onClick', name);
    setIsOpen(!isOpen);
  }, [isOpen, name, setIsOpen]);

  const onClose = useCallback(() => {
    console.log('onClose', name);
    setIsOpen(false);
  }, [name, setIsOpen]);

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      content={PopupContent}
      trigger={triggerProps => (
        <Button {...triggerProps} onClick={onClick}>
          {isOpen ? 'Close' : 'Open'} {name} popup
        </Button>
      )}
      placement="bottom-start"
    />
  );
};

const containerCSS = {
  display: 'flex',
};

export default () => (
  <div css={containerCSS}>
    <PopupExample name="foo" />
    <PopupExample name="bar" />
    <PopupExample name="baz" />
  </div>
);
