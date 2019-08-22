import React from 'react';
export const DropdownContext = React.createContext({
  state: {
    appearance: 'default',
    boundriesElement: 'viewport',
    isOpen: false,
    position: 'bottom-end',
    shouldFitContainer: false,
    shouldFlip: true,
    selectionIndex: -1,
  },
  changeState: ({}): void => {},
  toggleOpen: () => {},
});
