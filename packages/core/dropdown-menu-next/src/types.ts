import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Placement } from '@atlaskit/popper';

export type DefaultButtonProps = {
  text: string;
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
};

export type DropdownMenuProps = {
  /**
   * Controls the appearance of the menu.
   * Default menu has scroll after its height exceeds the pre-defined amount.
   * Tall menu has no scroll until the height exceeds the height of the viewport.
   */
  appearance?: 'default' | 'tall';
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';
  /** Default menu open state */
  defaultIsOpen?: boolean;
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
};

export type DropdownState = {
  appearance: 'default' | 'tall';
  boundriesElement: 'viewport' | 'window' | 'scrollParent';
  isOpen: boolean;
  position: Placement;
  shouldFitContainer: boolean;
  shouldFlip: boolean;
  selectionIndex: number;
};

export type DropdownTriggerProps = {
  text?: string;
};
