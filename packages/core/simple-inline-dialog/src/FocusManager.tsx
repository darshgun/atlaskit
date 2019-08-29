import { FC, useState, useEffect } from 'react';
import { FocusManagerProps } from './types';
import createFocusTrap, { FocusTrap } from 'focus-trap';

const noop = () => {};

export const FocusManager: FC<FocusManagerProps> = ({
  dialogRef,
  isOpen,
  onClose,
}) => {
  const [focusTrap, setFocusTrap] = useState<FocusTrap>({
    activate: noop,
    deactivate: noop,
    pause: noop,
    unpause: noop,
  });

  const handleClick = ({ target }: MouseEvent) => {
    if (isOpen && (dialogRef && !dialogRef.contains(target as Node))) {
      closeDialog();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    switch (key) {
      case 'Escape':
      case 'Esc':
        closeDialog();
        break;
      default:
    }
  };

  const closeDialog = () => {
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    onClose();
  };

  useEffect(
    () => {
      const trapConfig = {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        fallbackFocus: dialogRef,
        returnFocusOnDeactivate: true,
      };

      if (dialogRef) {
        const innerFocusTrap = createFocusTrap(dialogRef, trapConfig);
        setFocusTrap(innerFocusTrap);
        innerFocusTrap.activate();
      }

      return () => {
        focusTrap.deactivate();
      };
    },
    [dialogRef],
  );

  useEffect(
    () => {
      if (isOpen && dialogRef) {
        setTimeout(() => {
          window.addEventListener('click', handleClick);
          window.addEventListener('keydown', handleKeyDown);
        }, 1);
      }

      return () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [isOpen, dialogRef],
  );

  return null;
};
