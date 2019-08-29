import React from 'react';
import Item from '@atlaskit/item';

const assignRef = (ref, value) => {
  if (ref == null) return;
  if (typeof ref === 'function') {
    ref(value);
  } else {
    try {
      ref.current = value;
    } catch (error) {
      throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
    }
  }
};

export const MenuItem = React.forwardRef(
  (
    {
      onClick,
      role = 'menuitem',
      state,
      setState,
      index,
      onKeyDown,
      onMouseMove,
      onMouseLeave,
      _ref,
      ...rest
    },
    ref,
  ) => {
    let isSelected = index === state.selectionIndex;
    let select = () => {
      setState({ isOpen: false });
    };
    return (
      <Item
        {...rest}
        ref={node => {
          assignRef(ref, node);
          assignRef(_ref, node);
        }}
        role={role}
        tabIndex="-1"
        selected={isSelected ? true : undefined}
        onClick={event => {
          select();
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            // prevent the button from being "clicked" by
            // this "Enter" keydown
            event.preventDefault();
            select();
          }
        }}
        onMouseMove={event => {
          if (!isSelected) {
            setState({ selectionIndex: index });
          }
        }}
        onMouseLeave={event => {
          // clear out selection when mouse over a non-menu item child
          setState({ selectionIndex: -1 });
        }}
      />
    );
  },
);
