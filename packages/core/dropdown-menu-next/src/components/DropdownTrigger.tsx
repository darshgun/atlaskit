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
      {({ toggleOpen }) => (
        <Reference>
          {({ ref }) => {
            return (
              <NodeResolver
                innerRef={(node: HTMLElement) => {
                  ref(node);
                }}
              >
                {children ? (
                  children
                ) : (
                  <DefaultButton text="test" onClick={toggleOpen} />
                )}
              </NodeResolver>
            );
          }}
        </Reference>
      )}
    </DropdownContext.Consumer>
  );
});
