/**This component is a wrapper that takes props, sets up the default state and a context to pass that state, and returns render Props if needed */
import React, { FC, memo, useState, useEffect } from 'react';
import NodeResolver from 'react-node-resolver';
import ScrollLock from 'react-scrolllock';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledMenu } from './styled';
import { DialogProps } from './types';
import { FocusManager } from './FocusManager';

export const Dialog: FC<DialogProps> = memo(
  ({
    appearance,
    boundariesElement,
    isOpen,
    id,
    position,
    shouldFitContainer,
    shouldFlip,
    testId,
    content,
    children,
    onOpen,
    onClose,
  }) => {
    const [dialogRef, setDialogRef] = useState<HTMLDivElement>();

    useEffect(
      () => {
        if (isOpen && onOpen) {
          onOpen();
        }
      },
      [isOpen],
    );

    return (
      <div style={{ position: 'relative' }}>
        <FocusManager dialogRef={dialogRef} isOpen={isOpen} onClose={onClose} />
        <Manager>
          <Reference>
            {({ ref }) => {
              return (
                <NodeResolver
                  innerRef={(node: HTMLElement) => {
                    ref(node);
                  }}
                >
                  {children}
                </NodeResolver>
              );
            }}
          </Reference>
          {isOpen ? (
            <Portal>
              <Popper placement={position}>
                {({ ref, style, placement }) => {
                  return (
                    <div
                      ref={(node: HTMLDivElement) => {
                        ref(node);
                        setDialogRef(node);
                      }}
                      style={style}
                      data-placement={placement}
                    >
                      <ScrollLock />
                      <StyledMenu
                        id={id}
                        data-test-id={testId}
                        shouldFitContainer={shouldFitContainer}
                      >
                        {content}
                      </StyledMenu>
                    </div>
                  );
                }}
              </Popper>
            </Portal>
          ) : null}
        </Manager>
      </div>
    );
  },
);
