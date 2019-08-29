/**This component is a wrapper that takes props, sets up the default state and a context to pass that state, and returns render Props if needed */
import React, { useState, useLayoutEffect } from 'react';
import { Manager } from '@atlaskit/popper';
import { DropdownContext } from '../index';
import { DropdownMenuProps } from '../types';
import { FocusManager } from './FocusManager';

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
    menuRef: null,
    buttonRef: null,
    open: () => {},
    close: () => {},
  });

  React.useLayoutEffect(
    () => {
      if (props.position && props.position !== state.position) {
        stateChanger({ position: props.position });
      }
    },
    [props.position],
  );

  React.useLayoutEffect(
    () => {
      if (state.isOpen) {
        state.open();
      } else {
        state.close();
      }
    },
    [state.isOpen],
  );

  const stateChanger = (newStateObj: object) => {
    setState({ ...state, ...newStateObj });
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
          value={{
            refs: { button: null, menu: null, items: [] },
            state,
            setState: stateChanger,
          }}
        >
          <FocusManager />
          {typeof children === 'function'
            ? children({
                refs: { button: null, menu: null, items: [] },
                state,
                setState: stateChanger,
              }) //this allows render Prop usage by children not hiding
            : children}
        </DropdownContext.Provider>
      </Manager>
    </div>
  );
});

DropDownMenu.displayName = 'DropdownMenu';

export default DropDownMenu;
