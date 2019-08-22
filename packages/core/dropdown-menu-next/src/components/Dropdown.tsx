/**This component is a wrapper that takes props, sets up the default state and a context to pass that state, and returns render Props if needed */
import React, { useState, useEffect } from 'react';
import { Manager } from '@atlaskit/popper';
import { DropdownContext } from '../index';
import { DropdownMenuProps, DropdownState } from '../types';

export const DropDownMenu: React.FunctionComponent<
  DropdownMenuProps
> = React.memo(props => {
  const [state, setState] = useState({
    appearance: props.appearance || 'default',
    boundriesElement: props.boundariesElement || 'viewport',
    isOpen: props.defaultIsOpen || false,
    position: props.position || 'bottom-end',
    shouldFitContainer: props.shouldFitContainer || false,
    shouldFlip: props.shouldFlip || true,
    selectionIndex: -1,
  });

  React.useEffect(
    () => {
      stateChanger({ position: props.position });
    },
    [props.position],
  );

  const stateChanger = (newStateObj: object) => {
    setState({ ...state, ...newStateObj });
  };

  const toggleOpen = () => {
    setState({ ...state, isOpen: !state.isOpen });
  };

  const { children } = props;

  return (
    <div
      id={props.id}
      data-test-id={props.testId}
      style={{ position: 'relative' }}
    >
      <Manager>
        <DropdownContext.Provider
          value={{ state, changeState: stateChanger, toggleOpen }}
        >
          {typeof children === 'function'
            ? children({ state, changeState: stateChanger, toggleOpen }) //this allows render Prop usage by children not hiding
            : children}
        </DropdownContext.Provider>
      </Manager>
    </div>
  );
});

DropDownMenu.displayName = 'DropdownMenu';

export default DropDownMenu;
