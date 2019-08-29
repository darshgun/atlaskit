import React from 'react';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';

import { DropdownContext } from '../index';
import { StyledMenu } from '../styled/DropdownStyles';

export const MenuList = ({ ...props }) => {
  const children = props.children;
  return (
    <DropdownContext.Consumer>
      {({ refs, state, setState }) => (
        <React.Fragment>
          {state.isOpen ? (
            <Portal>
              <Popper placement={state.position}>
                {({ ref, style, placement }) => {
                  return (
                    <div
                      ref={node => {
                        ref(node);
                        refs.menu = node;
                      }}
                      style={style}
                      data-placement={placement}
                    >
                      <StyledMenu shouldFitContainer={state.shouldFitContainer}>
                        {React.Children.map(children, (child, index) => {
                          return React.cloneElement(child, {
                            setState,
                            state,
                          });
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
