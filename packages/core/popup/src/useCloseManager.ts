import { useEffect } from 'react';
import { CloseManagerHook } from './types';

export const useCloseManager = ({
  isOpen,
  onClose,
  popupRef,
}: CloseManagerHook): void => {
  useEffect(
    () => {
      const closePopup = () => {
        if (onClose) {
          onClose();
        }
      };

      const onClick = ({ target }: MouseEvent) => {
        if (popupRef && !popupRef.contains(target as Node)) {
          closePopup();
        }
      };

      const onKeyDown = (event: KeyboardEvent) => {
        const { key } = event;
        if (key === 'Escape' || key === 'Esc') {
          closePopup();
        }
      };

      if (isOpen && popupRef) {
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);
      }

      return () => {
        document.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKeyDown);
      };
    },
    [popupRef, isOpen, onClose],
  );
};
