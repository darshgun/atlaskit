/** @jsx jsx */
import { FC, forwardRef, memo, useState } from 'react';
import { layers } from '@atlaskit/theme/constants';
import { Manager, Popper, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { jsx } from '@emotion/core';

import { containerCSS, popupCSS } from './styles';
import { PopupComponentProps, PopupProps } from './types';
import { RepositionOnUpdate } from './RepositionOnUpdate';
import { useCloseManager } from './useCloseManager';
import { useFocusManager } from './useFocusManager';

const DefaultPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>(
  (props, ref) => <div css={popupCSS} ref={ref} {...props} />,
);

export const Popup: FC<PopupProps> = memo(
  ({
    boundariesElement,
    isOpen,
    id,
    offset,
    placement,
    shouldFlip = true,
    testId,
    content: Content,
    trigger,
    onClose,
    popupComponent: PopupContainer = DefaultPopupComponent,
    zIndex = layers.layer(),
  }: PopupProps) => {
    const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);
    const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
    const [initialFocusRef, setInitialFocusRef] = useState<HTMLElement | null>(
      null,
    );

    useFocusManager({ initialFocusRef, popupRef });
    useCloseManager({ isOpen, onClose, popupRef, triggerRef });

    return (
      <div css={containerCSS}>
        <Manager>
          <Reference>
            {({ ref }) => {
              return trigger({
                ref: (node: HTMLElement | null) => {
                  if (node) {
                    ref(node);
                    setTriggerRef(node);
                  }
                },
                'aria-controls': id,
                'aria-expanded': isOpen,
                'aria-haspopup': true,
              });
            }}
          </Reference>
          {isOpen && (
            <Portal zIndex={zIndex}>
              <Popper
                placement={placement || 'auto'}
                offset={offset}
                modifiers={{
                  flip: {
                    enabled: shouldFlip || true,
                    boundariesElement: boundariesElement || 'viewport',
                  },
                }}
              >
                {({ ref, style, placement, scheduleUpdate }) => {
                  return (
                    <PopupContainer
                      id={id}
                      data-placement={placement}
                      data-testid={testId}
                      ref={(node: HTMLDivElement) => {
                        ref(node);
                        setPopupRef(node);
                      }}
                      style={style}
                      tabIndex={-1}
                    >
                      <RepositionOnUpdate
                        content={Content}
                        scheduleUpdate={scheduleUpdate}
                      >
                        <Content
                          scheduleUpdate={scheduleUpdate}
                          isOpen={isOpen}
                          onClose={onClose}
                          setInitialFocusRef={setInitialFocusRef}
                        />
                      </RepositionOnUpdate>
                    </PopupContainer>
                  );
                }}
              </Popper>
            </Portal>
          )}
        </Manager>
      </div>
    );
  },
);
