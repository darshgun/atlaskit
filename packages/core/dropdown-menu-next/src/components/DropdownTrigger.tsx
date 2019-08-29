import React from 'react';
import { DropdownContext } from '../index';
import NodeResolver from 'react-node-resolver';
import { Reference } from '@atlaskit/popper';
import DefaultButton from './DefaultButton';
import { DropdownTriggerProps, reactRef } from '../types';

export const DropdownTrigger: React.FunctionComponent<
  DropdownTriggerProps
> = React.memo(({ ...props }) => {
  const { children } = props;
  return (
    <DropdownContext.Consumer>
      {({ refs, state, setState }) => (
        <Reference>
          {({ ref }) => {
            const assignButtonRef = (node: reactRef) => (refs.button = node);
            return (
              <NodeResolver
                innerRef={(node: HTMLElement) => {
                  ref(node);
                }}
              >
                {children ? (
                  children
                ) : (
                  <DefaultButton
                    text="test"
                    onClick={() => {
                      setState({ isOpen: !state.isOpen });
                    }}
                    ref={assignButtonRef}
                  />
                )}
              </NodeResolver>
            );
          }}
        </Reference>
      )}
    </DropdownContext.Consumer>
  );
});
