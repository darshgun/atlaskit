import React, { FC, memo, useState, useEffect } from 'react';
import ScrollLock from 'react-scrolllock';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledMenu, MenuRelContainer } from './styled';
import { DialogProps } from './types';
import { useFocusManager } from './useFocusManager';

export const Dialog: FC<DialogProps> = memo(
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
    trigger,
    onOpen,
    onClose,
  }) => {
    const [dialogRef, setDialogRef] = useState<HTMLDivElement>();

    useFocusManager({ dialogRef, isOpen, onClose });

    useEffect(
      () => {
        if (isOpen) {
          onOpen && onOpen();
        }
      },
      [isOpen, onOpen],
    );

    return (
      <MenuRelContainer>
        <Manager>
          <Reference>
            {({ ref }) =>
              trigger({
                ref,
                'aria-controls': id,
                'aria-expanded': isOpen,
                'aria-haspopup': true,
              })
            }
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
                {({ ref, style, placement }) => {
                  return (
                    <StyledMenu
                      id={id}
                      data-testid={testId}
                      ref={(node: HTMLDivElement) => {
                        ref(node);
                        setDialogRef(node);
                      }}
                      style={style}
                      data-placement={placement}
                      minWidth={minWidth}
                      maxWidth={maxWidth}
                      minHeight={minHeight}
                      maxHeight={maxHeight}
                      overflow={overflow}
                      shouldFitContainer={shouldFitContainer}
                    >
                      <ScrollLock />
                      {content}
                    </StyledMenu>
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
