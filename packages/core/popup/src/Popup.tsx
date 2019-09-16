import React, {
  FC,
  memo,
  useState,
  useEffect,
  useLayoutEffect,
  Fragment,
} from 'react';
import ScrollLock from 'react-scrolllock';
import { layers } from '@atlaskit/theme/constants';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { StyledPopup, PopupRelContainer } from './styled';
import { PopupProps, RepositionOnUpdateProps } from './types';
import { useFocusManager } from './useFocusManager';

const RepositionOnUpdate: FC<RepositionOnUpdateProps> = ({
  children,
  scheduleUpdate,
}) => {
  useLayoutEffect(
    () => {
      //callback function from popper that repositions pop-up on content Update
      scheduleUpdate();
    },
    [children, scheduleUpdate],
  );
  // wrapping in fragment to make TS happy (known issue with FC returning children)
  return <Fragment>{children}</Fragment>;
};

const Popup: FC<PopupProps> = memo(
  ({
    boundariesElement,
    isOpen,
    id,
    placement,
    shouldFlip = true,
    testId,
    content,
    trigger,
    onOpen,
    onClose,
    lockBodyScroll = false,
    popupComponent: PopupWrapper = StyledPopup,
    zIndex = layers.layer(),
  }: PopupProps) => {
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
                placement={placement || 'auto'}
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
                      <RepositionOnUpdate scheduleUpdate={scheduleUpdate}>
                        {content({
                          scheduleUpdate,
                          isOpen,
                          onClose,
                          setInitialFocusRef,
                        })}
                      </RepositionOnUpdate>
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

export default Popup;
