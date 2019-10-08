import {
  CSSProperties,
  Dispatch,
  FC,
  ReactNode,
  Ref,
  SetStateAction,
} from 'react';
import { Placement } from '@atlaskit/popper';

export type TriggerProps = {
  ref: any;
  'aria-controls'?: string;
  'aria-expanded': boolean;
  'aria-haspopup': boolean;
};

export type ContentProps = {
  scheduleUpdate(): void;
  isOpen: boolean;
  onClose: (() => void) | undefined;
  setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | undefined>>;
};

export type PopupRef = HTMLDivElement | undefined;

export type PopupComponentProps = {
  children: ReactNode;
  'data-placement': Placement;
  'data-testid'?: string;
  id?: string;
  ref: Ref<HTMLDivElement>;
  style: CSSProperties;
  tabIndex: number;
};

export type PopupProps = {
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';
  /** HTML Id for testing etc */
  id?: string;
  /** Positioning string of the Popup. See the documentation of @atlaskit/popper for more details. */
  placement?: Placement;
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
  /** Open State of the Dialog */
  isOpen: boolean;
  /** Component used to anchor the popup to your content. Usually a button used to open the popup */
  trigger: FC<TriggerProps>;
  /** The container displayed in the portal that wraps the content. Use to override the default white background with rounded corners */
  popupComponent?: FC<PopupComponentProps>;
  /** Optional override for the z-index for the react portal */
  zIndex?: number;
};

export type CloseManagerHook = Pick<PopupProps, 'isOpen' | 'onClose'> & {
  popupRef: PopupRef;
};

export type FocusManagerHook = {
  popupRef: PopupRef;
  initialFocusRef: HTMLElement | undefined;
};

export type RepositionOnUpdateProps = {
  content: FC<ContentProps>;
  scheduleUpdate(): void;
};
