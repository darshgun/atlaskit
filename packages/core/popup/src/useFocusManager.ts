import { useEffect } from 'react';
import { FocusManagerHook } from './types';
import createFocusTrap from 'focus-trap';

const noop = () => {};

export const useFocusManager = ({
  popupRef,
  initialFocusRef,
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
        initialFocus: initialFocusRef || popupRef,
        fallbackFocus: popupRef,
        returnFocusOnDeactivate: true,
      };

      if (popupRef) {
        focusTrap = createFocusTrap(popupRef, trapConfig);
        focusTrap.activate();
      }

      return () => {
        focusTrap.deactivate();
      };
    },
    [popupRef, initialFocusRef],
  );

  useEffect(
    () => {
      const handleClick = ({ target }: MouseEvent) => {
        if (isOpen && (popupRef && !popupRef.contains(target as Node))) {
          closePopup();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        switch (key) {
          case 'Escape':
          case 'Esc':
            closePopup();
            break;
          default:
        }
      };

      const closePopup = () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
        if (onClose) {
          onClose();
        }
      };

      if (isOpen && popupRef) {
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
    [popupRef, isOpen, onClose],
  );
};
