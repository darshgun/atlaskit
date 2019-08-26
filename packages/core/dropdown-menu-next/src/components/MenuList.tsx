import React from 'react';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';

import { DropdownContext } from '../index';
import { StyledMenu } from '../styled/DropdownStyles';
import { reactRef } from '../types';
import { MenuItem } from './MenuItem';

let focusableChildrenTypes = [MenuItem, 'MenuLink'];
let isFocusableChildType = (child: React.Ref<HTMLElement>) =>
  focusableChildrenTypes.includes(child.type);
let getFocusableMenuChildren = (children: reactRef[]) => {
  let focusable: React.Ref<HTMLElement>[] = [];
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
      {({ refs, state, setState, toggleOpen }) => (
        <React.Fragment>
          {state.isOpen ? (
            <Portal>
              <Popper placement={state.position}>
                {({ ref, style, placement, outOfBoundaries }) => {
                  return (
                    <div ref={ref} style={style} data-placement={placement}>
                      <StyledMenu
                        shouldFitContainer={state.shouldFitContainer}
                        onBlur={toggleOpen}
                        ref={node => {
                          refs.menu = node;
                        }}
                      >
                        {React.Children.map(children, (child, index) => {
                          if (isFocusableChildType(child)) {
                            let focusIndex = focusableChildren.indexOf(child);

                            return React.cloneElement(child, {
                              setState,
                              state,
                              index: focusIndex,
                              _ref: (node: React.Ref<HTMLElement>) =>
                                (refs.items[focusIndex] = node),
                            });
                          }
                          return child;
                        })}
                      </StyledMenu>
                    </div>
                  );
                }}
              </Popper>
            </Portal>
          ) : null}
        </React.Fragment>
      )}
    </DropdownContext.Consumer>
  );
};
