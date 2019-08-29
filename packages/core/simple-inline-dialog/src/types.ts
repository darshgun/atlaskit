import { ReactNode } from 'react';
import { Placement } from '@atlaskit/popper';

export type ReactRef = React.Ref<HTMLElement> | HTMLElement | null;

export type DialogProps = {
  /**
   * Controls the appearance of the menu.
   * Default menu has scroll after its height exceeds the pre-defined amount.
   * Tall menu has no scroll until the height exceeds the height of the viewport.
   */
  appearance?: 'default' | 'tall';
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';
  /** Default menu open state */
  isOpen: boolean;
  /** HTML Id for testing etc */
  id?: string;
  /** Position of the menu. See the documentation of @atlaskit/layer for more details. */
  position?: Placement;
  /** Option to fit dropdown menu width to its parent width */
  shouldFitContainer?: boolean;
  /** Allows the dropdown menu to be placed on the opposite side of its trigger if it does not
   * fit in the viewport. */
  shouldFlip?: boolean;
  /**testId maps to data-test-id for testing in your application */
  testId?: string;

  content: ReactNode;

  onClose(): void;
};

export type DialogContextShape = {
  menuRef: ReactRef | HTMLElement | null;
  closeDialog(): void;
};

type StyledMenu = {
  shouldFitContainer: boolean;
  maxWidth: number;
  minWidth: number;
};

export type fullStyledMenu = Partial<StyledMenu>;

export type FocusManagerProps = {
  dialogRef: HTMLDivElement | undefined;
  isOpen: boolean;
  onClose(): void;
};
