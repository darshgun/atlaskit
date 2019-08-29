import React from 'react';
import { FocusManagerProps } from '../types';
import { DropdownContext } from '../index';
import createFocusTrap, { FocusTrap } from 'focus-trap';

const noop = () => {};

class FocusManagerComponent extends React.Component<FocusManagerProps> {
  focusTrap: FocusTrap = {
    activate: noop,
    deactivate: noop,
    pause: noop,
    unpause: noop,
  };

  initialiseFocusTrap = () => {
    const { refs } = this.props;
    const trapConfig = {
      clickOutsideDeactivates: true,
      escapeDeactivates: true,
      fallbackFocus: refs.menu,
      returnFocusOnDeactivate: true,
    };
    console.log(refs.menu);
    if (!refs.menu) return;
    this.focusTrap = createFocusTrap(refs.menu, trapConfig);

    // allow time for the HTMLElement to render
    setTimeout(() => this.focusTrap.activate(), 1);
  };

  open = () => {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('click', this.handleClick);
  };

  close = () => {
    this.focusTrap.deactivate();
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  componentDidMount() {
    if (typeof window === 'undefined') return;
    this.props.setState({ open: this.open, close: this.close });
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { state, refs } = this.props;
    const { prevState, refs: prevRefs } = prevProps;
    console.log(refs);
    if (refs.menu && !prevRefs.menu) {
      this.initialiseFocusTrap();
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    switch (key) {
      case 'Escape':
      case 'Esc':
        this.props.setState({ isOpen: false });
        break;
      default:
    }
    // if (this.props.handleKeyDown) {
    //   this.props.handleKeyDown(event);
    // }
  };

  handleClick = ({ target }: MouseEvent) => {
    const { isOpen } = this.props.state;
    const { menu: menuRef, button } = this.props.refs;
    // NOTE: Why not use the <Blanket /> component to close?
    // We don't want to interupt the user's flow. Taking this approach allows
    // user to click "through" to other elements and close the popout.
    if (
      isOpen &&
      (menuRef && !menuRef.contains(target) && !button.contains(target))
    ) {
      this.props.setState({ isOpen: false });
    }
  };

  render() {
    return null;
  }
}

export const FocusManager = () => (
  <DropdownContext.Consumer>
    {({ refs, state, setState }) => {
      return (
        <FocusManagerComponent refs={refs} state={state} setState={setState} />
      );
    }}
  </DropdownContext.Consumer>
);
