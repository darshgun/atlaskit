import { ReactNode } from 'react';
import { Placement } from '@atlaskit/popper';

export type ReactRef = React.Ref<HTMLElement> | HTMLElement | null;

type overflow =
  | 'visible'
  | 'hidden'
  | 'scroll'
  | 'auto'
  | `overflow-x`
  | `overflow-y`;

type TriggerProps = {
  ref: any;
  'aria-controls'?: string;
  'aria-expanded': boolean;
  'aria-haspopup': boolean;
};

export type DialogProps = {
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';
  /** HTML Id for testing etc */
  id?: string;
  /** Minimum height for the pop-over any valid css value can be accepted: `10px`, `50%`, etc. */
  minHeight?: string;
  /** Minimum width for the pop-over any valid css value can be accepted: `10px`, `50%`, etc. */
  minWidth?: string;
  /** Maximum height for the pop-over any valid css value can be accepted: `10px`, `50%`, etc. */
  maxHeight?: string;
  /** Maximum height for the pop-over any valid css value can be accepted: `10px`, `50%`, etc. */
  maxWidth?: string;
  /**
   * Controls Overflow behavior of the Dialog
   * accepts all valid css properties for overflow or overflow-x/overflow-y
   * default: auto
   */
  overflow?: overflow;
  /** Position of the menu. See the documentation of @atlaskit/popper for more details. */
  position?: Placement;
  /** Option to fit dropdown menu width to its parent width overrides maxWidth if provided*/
  shouldFitContainer?: boolean;
  /** Allows the dropdown menu to be placed on the opposite side of its trigger if it does not
   * fit in the viewport. */
  shouldFlip?: boolean;
  /** testId maps to data-testid for testing in your application */
  testId?: string;
  /** Content to display in the dialog */
  content: ReactNode;
  /** Callback function when the dialog is opened */
  onOpen?(): void;
  /** Callback function when the dialog is closed */
  onClose?(): void;

  isOpen: boolean;

  trigger(arg0: TriggerProps): ReactNode;
};

type StyledMenu = {
  shouldFitContainer: boolean;
  overflow?: overflow;
  maxHeight: string;
  maxWidth: string;
  minHeight: string;
  minWidth: string;
};

export type fullStyledMenu = Partial<StyledMenu>;

export type FocusManagerHook = {
  dialogRef: HTMLDivElement | undefined;
  isOpen: boolean;
  onClose?(): void;
};
