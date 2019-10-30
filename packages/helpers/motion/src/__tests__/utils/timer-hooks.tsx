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
    const Component = (props: { callback: Function }) => {
      const requestAnimationFrame = useRequestAnimationFrame();
      requestAnimationFrame(() => props.callback());
      return null;
    };

    it('should not callback immediately', () => {
      const callback = jest.fn();

      render(<Component callback={callback} />);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should callback next frame', () => {
      const callback = jest.fn();
      render(<Component callback={callback} />);

      (requestAnimationFrame as any).step();

      expect(callback).toHaveBeenCalled();
    });

    it('should not callback when the effect is cleared', () => {
      const callback = jest.fn();
      const { rerender } = render(<Component callback={callback} />);
      rerender(<Component callback={jest.fn()} />);

      (requestAnimationFrame as any).step();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('useSetTimeout()', () => {
    const Component = (props: { callback: Function }) => {
      const setTimeout = useSetTimeout();
      setTimeout(() => props.callback(), 100);
      return null;
    };

    it('should not callback immediately', () => {
      const callback = jest.fn();

      render(<Component callback={callback} />);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should callback next frame', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      render(<Component callback={callback} />);

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();
    });

    it('should not callback when the effect is cleared', () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const { rerender } = render(<Component callback={callback} />);
      rerender(<Component callback={jest.fn()} />);

      jest.runAllTimers();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
