import { useState, useEffect } from 'react';
import { FocusManagerHook } from './types';
import createFocusTrap, { FocusTrap } from 'focus-trap';

const noop = () => {};

export const useFocusManager = ({
  dialogRef,
  isOpen,
  onClose,
}: FocusManagerHook): void => {
  const [focusTrap, setFocusTrap] = useState<FocusTrap>({
    activate: noop,
    deactivate: noop,
    pause: noop,
    unpause: noop,
  });

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
        if (onClose) {
          onClose();
        }
      };

      if (isOpen && dialogRef) {
        window.requestAnimationFrame(() => {
          window.addEventListener('click', handleClick);
          window.addEventListener('keydown', handleKeyDown);
        });
      }

      return () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [isOpen, dialogRef],
  );
};
