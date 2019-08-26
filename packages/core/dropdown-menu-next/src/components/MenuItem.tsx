import React from 'react';

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
      <div
        {...rest}
        ref={node => {
          assignRef(ref, node);
          assignRef(_ref, node);
        }}
        data-reach-menu-item={role === 'menuitem' ? true : undefined}
        role={role}
        tabIndex="-1"
        data-selected={role === 'menuitem' && isSelected ? true : undefined}
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
