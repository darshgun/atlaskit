import React, {
  FC,
  memo,
  useState,
  useEffect,
  ReactElement,
  PropsWithChildren,
} from 'react';
import ScrollLock from 'react-scrolllock';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledMenu, MenuRelContainer } from './styled';
import { DialogProps, ContentContainerProps } from './types';
import { useFocusManager } from './useFocusManager';

const ContentContainer: FC<ContentContainerProps> = ({
  scheduleUpdate,
  children,
}) => {
  useEffect(
    () => {
      scheduleUpdate();
    },
    [children],
  );
  return children;
};

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
                {({ ref, style, placement, scheduleUpdate }) => {
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
                      <ContentContainer scheduleUpdate={scheduleUpdate}>
                        {content
                          ? React.cloneElement(content as ReactElement, {
                              //passing these props allow the content to manage state
                              //and update the popper-positioning on changes that don't trigger re-renders
                              scheduleUpdate,
                              isOpen,
                              onClose,
                            })
                          : null}
                      </ContentContainer>
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
