import { useEffect } from 'react';
import { FocusManagerHook } from './types';
import createFocusTrap from 'focus-trap';

const noop = () => {};

export const useFocusManager = ({
  dialogRef,
  isOpen,
  onClose,
}: FocusManagerHook): void => {
  useEffect(
    () => {
      let focusTrap = {
        activate: noop,
        deactivate: noop,
        pause: noop,
        unpause: noop,
      };

      const trapConfig = {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        fallbackFocus: dialogRef,
        returnFocusOnDeactivate: true,
      };

      if (dialogRef) {
        focusTrap = createFocusTrap(dialogRef, trapConfig);
        focusTrap.activate();
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
    [dialogRef, isOpen, onClose],
  );
};
