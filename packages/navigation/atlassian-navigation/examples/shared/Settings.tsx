import React, { useState } from 'react';
import Popup from '@atlaskit/popup';
import { Settings } from '../../src';

const SettingsContent = () => (
  <div style={{ width: 200, height: 200, padding: 16 }}>
    Fake settings content
  </div>
);

export const DefaultSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={SettingsContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={triggerProps => (
        <Settings onClick={onClick} tooltip="Settings" {...triggerProps} />
      )}
    />
  );
};
