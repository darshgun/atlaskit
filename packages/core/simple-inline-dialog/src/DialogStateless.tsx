import React, { FC, memo, useState, useEffect, ReactElement } from 'react';
import NodeResolver from 'react-node-resolver';
import ScrollLock from 'react-scrolllock';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledMenu } from './styled';
import { DialogProps } from './types';
import { FocusManager } from './FocusManager';

export const DialogStateless: FC<DialogProps> = memo(
  ({
    boundariesElement,
    isOpen,
    id,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
    overflow,
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
              <Popper
                placement={position}
                modifiers={{
                  flip: {
                    enabled: shouldFlip || true,
                    boundariesElement: boundariesElement || 'viewport',
                  },
                }}
              >
                {({ ref, style, placement, scheduleUpdate }) => {
                  return (
                    <div
                      id={id}
                      data-test-id={testId}
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
                        minWidth={minWidth}
                        maxWidth={maxWidth}
                        minHeight={minHeight}
                        maxHeight={maxHeight}
                        overflow={overflow}
                        shouldFitContainer={shouldFitContainer}
                      >
                        {content
                          ? React.cloneElement(content as ReactElement, {
                              scheduleUpdate,
                              onOpen,
                              onClose,
                            })
                          : null}
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
