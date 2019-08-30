import { ReactNode } from 'react';
import { Placement } from '@atlaskit/popper';
import { ButtonProps } from '@atlaskit/button';

export type ReactRef = React.Ref<HTMLElement> | HTMLElement | null;

type overflow =
  | 'visible'
  | 'hidden'
  | 'scroll'
  | 'auto'
  | `overflow-x`
  | `overflow-y`;

export type DialogPropsRoot = {
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';
  /** HTML Id for testing etc */
  id?: string;
  /** Minimum height for the pop-over any vlid css value can be accepted: `10px`, `50%`, etc. */
  minHeight?: string;
  /** Minimum width for the pop-over any vlid css value can be accepted: `10px`, `50%`, etc. */
  minWidth?: string;
  /** Maximum height for the pop-over any vlid css value can be accepted: `10px`, `50%`, etc. */
  maxHeight?: string;
  /** Maximum height for the pop-over any vlid css value can be accepted: `10px`, `50%`, etc. */
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
  /** testId maps to data-test-id for testing in your application */
  testId?: string;
  /**Content to display in the dialog */
  content: ReactNode;
  /** Callback function when the dialog is opened */
  onOpen?(): void;
  /** Callback function when the dialog is closed */
  onClose?(): void;
};

export type DialogPropsStateless = DialogPropsRoot & {
  /** Default menu open state */
  isOpen: boolean;
};

export type DialogProps = DialogPropsRoot & {
  /** Default menu open state */
  isOpen?: boolean;
  /**
   * Content which will trigger the dropdown menu to open and close. Use with triggerType to easily get a button trigger.
   */
  trigger?: ReactNode | string;
  /**
   * Props to pass through to the trigger button. See @atlaskit/button for allowed props.
   */
  triggerButtonProps?: ButtonProps;
  /**
   * Controls the type of trigger to be used for the dropdown menu.
   * The default trigger allows you to supply your own trigger component.
   * Setting this prop to button will render a Button component with an 'expand' icon,
   * and the trigger prop contents inside the button.
   */
  triggerType?: 'default' | 'button';
};

export type DialogContextShape = {
  menuRef: ReactRef | HTMLElement | null;
  closeDialog(): void;
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

export type FocusManagerProps = {
  dialogRef: HTMLDivElement | undefined;
  isOpen: boolean;
  onClose?(): void;
};
