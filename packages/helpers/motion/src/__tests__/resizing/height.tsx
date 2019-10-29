import React, { forwardRef } from 'react';
import { render } from '@testing-library/react';
import { useResizingHeight } from '../../resizing/height';
import { isReducedMotion } from '../../utils/accessibility';
import { mediumDurationMs } from '../../utils/durations';
import { easeInOut } from '../../utils/curves';

jest.mock('../../utils/accessibility');

Object.assign(window, {
  requestAnimationFrame: (cb: any) => {
    setTimeout(cb);
  },
});

const Container = forwardRef<HTMLElement, { id: string; height: number }>(
  ({ id, height, ...props }, ref) => {
    const getBoundingClientRect = () => ({ height });

    return (
      <div
        ref={element => {
          const newRef: HTMLDivElement | null = element
            ? Object.assign(element, { getBoundingClientRect })
            : null;

          if (typeof ref === 'function') {
            ref(newRef);
          } else {
            Object.assign(ref, { current: newRef });
          }
        }}
        {...props}
        data-testid={id}
      />
    );
  },
);

const TestComponent = (props: { height: number }) => (
  <Container {...useResizingHeight()} height={props.height} id="element" />
);

describe('<ResizingHeight />', () => {
  beforeEach(() => {
    (isReducedMotion as jest.Mock).mockReturnValue(false);
  });

  it('should do nothing if height did not change over an update', () => {
    const { getByTestId } = render(<TestComponent height={100} />);

    expect(getByTestId('element').getAttribute('style')).toEqual(null);
  });

  it('should do nothing if user has turned on reduced motion', () => {
    (isReducedMotion as jest.Mock).mockReturnValue(true);
    const { getByTestId, rerender } = render(<TestComponent height={100} />);

    rerender(<TestComponent height={500} />);

    expect(getByTestId('element').getAttribute('style')).toEqual(null);
  });

  it('should begin the animation from the before height', () => {
    const { getByTestId, rerender } = render(<TestComponent height={100} />);

    rerender(<TestComponent height={500} />);

    expect(getByTestId('element').style).toMatchObject({
      height: '100px',
    });
  });

  it('should prepare to animate between heights', () => {
    const { getByTestId, rerender } = render(<TestComponent height={100} />);

    rerender(<TestComponent height={500} />);

    expect(getByTestId('element').style).toMatchObject({
      'will-change': 'height',
      'transition-property': 'height',
      'transition-duration': `${mediumDurationMs}ms`,
      'transition-timing-function': easeInOut,
    });
  });

  it('should set box sizing when prepping the animation to ensure the height is the same after the animation ends', () => {
    const { getByTestId, rerender } = render(<TestComponent height={100} />);

    rerender(<TestComponent height={500} />);

    expect(getByTestId('element').style).toMatchObject({
      'box-sizing': 'border-box',
    });
  });

  it('should set the new height after two frames so the DOM can flush changes', () => {
    jest.useFakeTimers();
    const { getByTestId, rerender } = render(<TestComponent height={100} />);
    rerender(<TestComponent height={500} />);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    expect(getByTestId('element').style).toMatchObject({
      height: '500px',
    });
  });

  it('should clear the style from the element after the animation has finished', () => {
    jest.useFakeTimers();
    const { getByTestId, rerender } = render(<TestComponent height={100} />);
    rerender(<TestComponent height={500} />);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    expect(getByTestId('element').getAttribute('style')).toEqual('');
  });

  it('should cleanup when unmounting and not explode', () => {
    jest.useFakeTimers();
    const { rerender, unmount } = render(<TestComponent height={100} />);
    rerender(<TestComponent height={500} />);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    unmount();

    expect(() => {
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }).not.toThrow();
  });
});
