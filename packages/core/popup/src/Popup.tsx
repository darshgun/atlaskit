import React, { FC, memo, useState, useEffect, Fragment } from 'react';
import ScrollLock from 'react-scrolllock';
import { layers } from '@atlaskit/theme/constants';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledPopup, PopupRelContainer } from './styled';
import { PopupProps, ContentContainerProps } from './types';
import { useFocusManager } from './useFocusManager';

const ContentContainer: FC<ContentContainerProps> = ({
  children,
  scheduleUpdate,
}) => {
  useEffect(
    () => {
      scheduleUpdate();
    },
    [children, scheduleUpdate],
  );
  // wrapping in fragment to make TS happy (known issue with FC returning children)
  return <Fragment>{children}</Fragment>;
};

export const Popup: FC<PopupProps> = memo(
  ({
    boundariesElement,
    isOpen,
    id,
    position,
    shouldFlip,
    testId,
    content,
    trigger,
    onOpen,
    onClose,
    lockBodyScroll = false,
    popupComponent: PopupWrapper = StyledPopup,
    zIndex = layers.layer(),
  }) => {
    const [popupRef, setPopupRef] = useState<HTMLDivElement>();
    const [initialFocusRef, setInitialFocusRef] = useState<HTMLElement>();
    useFocusManager({ popupRef, initialFocusRef, isOpen, onClose });

    useEffect(
      () => {
        if (isOpen) {
          onOpen && onOpen();
        }
      },
      [isOpen, onOpen],
    );

    return (
      <PopupRelContainer>
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
            <Portal zIndex={zIndex}>
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
                    <PopupWrapper
                      id={id}
                      data-testid={testId}
                      ref={(node: HTMLDivElement) => {
                        ref(node);
                        setPopupRef(node);
                      }}
                      style={style}
                      data-placement={placement}
                      tabIndex={-1}
                    >
                      {lockBodyScroll && <ScrollLock />}
                      <ContentContainer scheduleUpdate={scheduleUpdate}>
                        {content({
                          scheduleUpdate,
                          isOpen,
                          onClose,
                          setInitialFocusRef,
                        })}
                      </ContentContainer>
                    </PopupWrapper>
                  );
                }}
              </Popper>
            </Portal>
          ) : null}
        </Manager>
      </PopupRelContainer>
    );
  },
);
