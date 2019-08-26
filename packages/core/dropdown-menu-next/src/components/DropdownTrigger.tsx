import React from 'react';
import { DropdownContext } from '../index';
import NodeResolver from 'react-node-resolver';
import { Reference } from '@atlaskit/popper';
import DefaultButton from './DefaultButton';
import { DropdownTriggerProps } from '../types';

export const DropdownTrigger: React.FunctionComponent<
  DropdownTriggerProps
> = React.memo(({ ...props }) => {
  const { children } = props;
  return (
    <DropdownContext.Consumer>
      {({ toggleOpen, refs }) => (
        <Reference>
          {({ ref }) => {
            const assignButtonRef = (node: Node) => (refs.button = node);
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
                    onClick={toggleOpen}
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
