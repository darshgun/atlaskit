import { useEffect } from 'react';
import { FocusManagerHook } from './types';
import createFocusTrap from 'focus-trap';

const noop = () => {};
let frameId: number | null;

export const useFocusManager = ({
  popupRef,
  initialFocusRef,
  isOpen,
  onClose,
}: FocusManagerHook): void => {
  useEffect(
    () => {
      if (!popupRef) {
        return noop;
      }

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

      window.requestAnimationFrame(() => {
        focusTrap = createFocusTrap(popupRef, trapConfig);
        focusTrap.activate();
      });

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
        if (key === 'Escape' || key === 'Esc') {
          closePopup();
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
        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          window.addEventListener('click', handleClick);
          window.addEventListener('keydown', handleKeyDown);
        });
      }

      return () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [popupRef, isOpen, onClose],
  );
};
