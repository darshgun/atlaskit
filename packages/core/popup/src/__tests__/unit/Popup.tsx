import { fireEvent, render } from '@testing-library/react';
import React, { Dispatch, forwardRef, SetStateAction } from 'react';
import { Popup } from '../../Popup';
import { PopupComponentProps, TriggerProps } from '../../types';

describe('Popup', () => {
  const defaultProps = {
    content: () => <div>content</div>,
    isOpen: false,
    trigger: (props: TriggerProps) => <button {...props}>trigger</button>,
  };

  it('renders the trigger correctly when the popup is closed', () => {
    const trigger = (props: TriggerProps) => (
      <button {...props}>trigger</button>
    );
    const { getByText } = render(
      <Popup {...defaultProps} isOpen={false} trigger={trigger} />,
    );

    const triggerEl = getByText('trigger');

    expect({
      'aria-expanded': triggerEl.getAttribute('aria-expanded'),
      'aria-haspopup': triggerEl.getAttribute('aria-haspopup'),
    }).toEqual({
      'aria-expanded': 'false',
      'aria-haspopup': 'true',
    });
  });

  it('renders the trigger correctly when the popup is open', () => {
    const trigger = (props: TriggerProps) => (
      <button {...props}>trigger</button>
    );
    const { getByText } = render(
      <Popup {...defaultProps} isOpen trigger={trigger} />,
    );

    const triggerEl = getByText('trigger');

    expect({
      'aria-expanded': triggerEl.getAttribute('aria-expanded'),
      'aria-haspopup': triggerEl.getAttribute('aria-haspopup'),
    }).toEqual({
      'aria-expanded': 'true',
      'aria-haspopup': 'true',
    });
  });

  it('does not render the content when the popup is closed', () => {
    const { queryByText } = render(
      <Popup
        {...defaultProps}
        content={() => <div>content</div>}
        isOpen={false}
      />,
    );
    expect(queryByText('content')).not.toBeInTheDocument();
  });

  it('renders the content correctly when the popup is open', () => {
    const { queryByText } = render(
      <Popup {...defaultProps} content={() => <div>content</div>} isOpen />,
    );
    expect(queryByText('content')).toBeInTheDocument();
  });

  it('does not render the custom popup when the popup is closed', () => {
    const { queryByText } = render(
      <Popup
        {...defaultProps}
        isOpen={false}
        popupComponent={forwardRef<HTMLDivElement, PopupComponentProps>(
          ({ children, ...props }, ref) => (
            <div ref={ref} {...props}>
              popup component
              <div>{children}</div>
            </div>
          ),
        )}
      />,
    );

    expect(queryByText('popup component')).not.toBeInTheDocument();
  });

  it('renders the custom popup and its content correctly when the popup is open', () => {
    const { queryByText } = render(
      <Popup
        {...defaultProps}
        content={() => <div>content</div>}
        isOpen
        popupComponent={forwardRef<HTMLDivElement, PopupComponentProps>(
          ({ children, ...props }, ref) => (
            <div ref={ref} {...props}>
              popup component
              <div>{children}</div>
            </div>
          ),
        )}
      />,
    );

    expect(queryByText('popup component')).toBeInTheDocument();
    expect(queryByText('content')).toBeInTheDocument();
  });

  it('does not call onClose after pressing escape when the popup is closed', async () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen={false} onClose={onClose} />,
    );

    fireEvent.keyDown(baseElement, { key: 'Escape', code: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose after pressing escape when the popup is open', async () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen onClose={onClose} />,
    );

    fireEvent.keyDown(baseElement, { key: 'Escape', code: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking on the trigger when the popup is open', async () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Popup
        {...defaultProps}
        isOpen
        onClose={onClose}
        trigger={() => <button>trigger</button>}
      />,
    );

    fireEvent.click(getByText('trigger'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after clicking outside of the popup when the popup is open', () => {
    const onClose = jest.fn();
    const { baseElement } = render(
      <Popup {...defaultProps} isOpen onClose={onClose} />,
    );

    fireEvent.click(baseElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when calling onClose within the content', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Popup
        {...defaultProps}
        content={({ onClose: onClick }) => <button onClick={onClick}>x</button>}
        isOpen
        onClose={onClose}
      />,
    );

    fireEvent.click(getByText('x'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not focus the content when the popup is open', () => {
    const { getByText } = render(
      <Popup {...defaultProps} content={() => <div>content</div>} isOpen />,
    );

    expect(getByText('content')).not.toHaveFocus();
  });

  it('focuses the specified element inside of the content when the popup is open', () => {
    const { getByText } = render(
      <Popup
        {...defaultProps}
        content={({ setInitialFocusRef }) => (
          <button
            ref={
              setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>
            }
          >
            focused content
          </button>
        )}
        isOpen
      />,
    );

    expect(getByText('focused content')).toHaveFocus();
  });
});
