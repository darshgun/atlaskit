import React from 'react';
import { Popper } from '@atlaskit/popper';
import { DropdownContext } from '../index';
import { StyledMenu } from '../styled/DropdownStyles';

let focusableChildrenTypes = ['MenuItem', 'MenuLink'];
let isFocusableChildType = child => focusableChildrenTypes.includes(child.type);
let getFocusableMenuChildren = children => {
  let focusable = [];
  React.Children.forEach(children, child => {
    if (isFocusableChildType(child)) focusable.push(child);
  });
  return focusable;
};

export const MenuList = ({ ...props }) => {
  const children = props.children;
  let focusableChildren = getFocusableMenuChildren(children);
  return (
    <DropdownContext.Consumer>
      {({ state, changeState, toggleOpen }) => (
        <React.Fragment>
          {state.isOpen ? (
            <Popper placement={state.position}>
              {({ ref, style, placement, outOfBoundaries }) => {
                return (
                  <div ref={ref} style={style} data-placement={placement}>
                    <StyledMenu
                      shouldFitContainer={state.shouldFitContainer}
                      onBlur={toggleOpen}
                    >
                      {React.Children.map(children, (child, index) => {
                        if (isFocusableChildType(child)) {
                          let focusIndex = focusableChildren.indexOf(child);

                          return React.cloneElement(child, {
                            changeState,
                            state,
                            index: focusIndex,
                            _ref: node => (refs.items[focusIndex] = node),
                          });
                        }

                        return child;
                      })}
                    </StyledMenu>
                  </div>
                );
              }}
            </Popper>
          ) : null}
        </React.Fragment>
      )}
    </DropdownContext.Consumer>
  );
};
