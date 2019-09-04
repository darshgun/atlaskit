import { Dispatch, SetStateAction, FC } from 'react';
import { Placement } from '@atlaskit/popper';

export type ReactRef = React.Ref<HTMLElement> | HTMLElement | null;

type TriggerProps = {
  ref: any;
  'aria-controls'?: string;
  'aria-expanded': boolean;
  'aria-haspopup': boolean;
};

type ContentProps = {
  scheduleUpdate(): void;
  isOpen: boolean;
  onClose: (() => void) | undefined;
  setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | undefined>>;
};

export type PopupProps = {
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';
  /** HTML Id for testing etc */
  id?: string;
  /** Position of the Popup. See the documentation of @atlaskit/popper for more details. */
  position?: Placement;
  /** Allows the Popup to be placed on the opposite side of its trigger if it does not
   * fit in the viewport. */
  shouldFlip?: boolean;
  /** testId maps to data-testid for testing in your application */
  testId?: string;
  /** Content to display in the Popup */
  content: FC<ContentProps>;
  /** Callback function when the Popup is opened */
  onOpen?(): void;
  /** Callback function when the Popup is closed */
  onClose?(): void;

  isOpen: boolean;

  trigger: FC<TriggerProps>;

  lockBodyScroll?: boolean;

  popupComponent?: FC;
};

export type FocusManagerHook = {
  popupRef: HTMLDivElement | undefined;
  initialFocusRef: HTMLElement | undefined;
  isOpen: boolean;
  onClose?(): void;
};

export type ContentContainerProps = {
  scheduleUpdate(): void;
};
