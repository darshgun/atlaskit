import React from 'react';
import { render } from '@testing-library/react';
import { replaceRaf } from 'raf-stub';
import {
  useRequestAnimationFrame,
  useSetTimeout,
} from '../../utils/timer-hooks';

replaceRaf();

describe('timer hooks', () => {
  beforeEach(() => jest.useRealTimers());

  describe('useRequestAnimationFrame()', () => {
    const Component = (props: {
      callback: Function;
      cleanup: 'next-effect' | 'unmount';
    }) => {
      const requestAnimationFrame = useRequestAnimationFrame({
        cleanup: props.cleanup,
      });
      requestAnimationFrame(() => props.callback());
      return null;
    };

    it('should not callback immediately', () => {
      const callback = jest.fn();

      render(<Component cleanup="unmount" callback={callback} />);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should callback next frame', () => {
      const callback = jest.fn();
      render(<Component cleanup="unmount" callback={callback} />);

      (requestAnimationFrame as any).step();

      expect(callback).toHaveBeenCalled();
    });

    it('should not callback when the effect is cleared', () => {
      const callback = jest.fn();
      const { rerender } = render(
        <Component cleanup="next-effect" callback={callback} />,
      );
      rerender(<Component cleanup="next-effect" callback={jest.fn()} />);

      (requestAnimationFrame as any).step();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not callback when the effect is unmounted', () => {
      const callback = jest.fn();
      const { unmount } = render(
        <Component cleanup="unmount" callback={callback} />,
      );

      unmount();
      (requestAnimationFrame as any).step();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('useSetTimeout()', () => {
    const Component = (props: {
      callback: Function;
      cleanup: 'next-effect' | 'unmount';
    }) => {
      const setTimeout = useSetTimeout({ cleanup: props.cleanup });
      setTimeout(() => props.callback(), 100);
      return null;
    };

    it('should not callback immediately', () => {
      const callback = jest.fn();

      render(<Component cleanup="unmount" callback={callback} />);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should callback next frame', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      render(<Component cleanup="unmount" callback={callback} />);

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();
    });

    it('should not callback when the effect is cleared', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const { rerender } = render(
        <Component cleanup="next-effect" callback={callback} />,
      );
      rerender(<Component cleanup="next-effect" callback={jest.fn()} />);

      jest.runAllTimers();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not callback when the effect is unmounted', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const { unmount } = render(
        <Component cleanup="unmount" callback={callback} />,
      );

      unmount();
      jest.runAllTimers();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
