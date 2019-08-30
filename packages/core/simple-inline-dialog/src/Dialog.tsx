import React, { FC, memo, useState, useEffect } from 'react';
import Button from '@atlaskit/button';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { DialogProps } from './types';
import { DialogStateless } from './DialogStateless';

export const Dialog: FC<DialogProps> = memo(
  ({
    boundariesElement,
    isOpen = false,
    id,
    minHeight = 'auto',
    maxHeight = 'auto',
    minWidth = 'auto',
    maxWidth = 'auto',
    overflow = 'auto',
    position = 'right-end',
    shouldFitContainer = false,
    shouldFlip = true,
    testId,
    content,
    children,
    onOpen,
    onClose,
    trigger,
    triggerButtonProps,
    triggerType = 'button',
  }) => {
    const [open, setOpen] = useState(isOpen || false);
    useEffect(
      () => {
        setOpen(isOpen);
        if (onOpen && isOpen) {
          onOpen();
          return;
        }
        if (onClose && !isOpen) {
          onClose();
        }
      },
      [isOpen],
    );

    const managedOnClose = () => {
      if (onClose) {
        onClose();
      }
      setOpen(false);
    };

    const renderTrigger = () => {
      console.log(triggerType);
      if (triggerType !== 'button') {
        return trigger;
      }

      const triggerProps = { ...triggerButtonProps };
      const defaultButtonProps = {
        'aria-controls': id,
        'aria-expanded': isOpen,
        onClick: () => setOpen(!open),
        'aria-haspopup': true,
        isSelected: isOpen,
      };
      if (!triggerProps.iconAfter && !triggerProps.iconBefore) {
        triggerProps.iconAfter = <ExpandIcon size="medium" label="" />;
      }
      return (
        <Button {...defaultButtonProps} {...triggerProps}>
          {trigger}
        </Button>
      );
    };

    return (
      <DialogStateless
        boundariesElement={boundariesElement}
        isOpen={open}
        id={id}
        minHeight={minHeight}
        maxHeight={maxHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        overflow={overflow}
        position={position}
        shouldFitContainer={shouldFitContainer}
        shouldFlip={shouldFlip}
        testId={testId}
        content={content}
        onClose={managedOnClose}
      >
        {renderTrigger()}
      </DialogStateless>
    );
  },
);
