import React from 'react';
import { DropdownContextShape } from './types';
export const DropdownContext = React.createContext<DropdownContextShape>({
  refs: { button: null, menu: null, items: [] },
  state: {
    appearance: 'default',
    boundriesElement: 'viewport',
    isOpen: false,
    position: 'bottom-end',
    shouldFitContainer: false,
    shouldFlip: true,
    selectionIndex: -1,
  },
  setState: ({}): void => {},
  toggleOpen: () => {},
});
