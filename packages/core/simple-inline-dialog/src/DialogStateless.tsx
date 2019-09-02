import React, { FC, memo, useState, useEffect, ReactElement } from 'react';
import NodeResolver from 'react-node-resolver';
import ScrollLock from 'react-scrolllock';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledMenu, MenuRelContainer } from './styled';
import { DialogPropsStateless } from './types';
import { useFocusManager } from './useFocusManager';

export const DialogStateless: FC<DialogPropsStateless> = memo(
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

    useFocusManager({ dialogRef, isOpen, onClose });

    return (
      <MenuRelContainer>
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
                      data-testid={testId}
                      ref={(node: HTMLDivElement) => {
                        ref(node);
                        setDialogRef(node);
                      }}
                      style={style}
                      data-placement={placement}
                    >
                      <ScrollLock />
                      <StyledMenu
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
      </MenuRelContainer>
    );
  },
);
