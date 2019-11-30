import React from 'react';
import { render, act } from '@testing-library/react';
import KeyframesMotion from '../../../entering/keyframes-motion';
import ExitingPersistence from '../../../entering/exiting-persistence';
import StaggeredEntrance from '../../../entering/staggered-entrance';

jest.mock('../../../utils/accessibility');

describe('<KeyframesMotion />', () => {
  const duration = 500;

  beforeEach(() => {
    jest.useRealTimers();
  });

  it('should callback when entering on finish', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    render(
      <KeyframesMotion
        animationTimingFunction={() => 'linear'}
        duration={duration}
        enteringAnimation={{}}
        onFinish={callback}
      >
        {props => <div {...props} />}
      </KeyframesMotion>,
    );

    jest.runTimersToTime(duration);

    expect(callback).toHaveBeenCalledWith('entering');
  });

  it('should callback when entering and in a staggered list on finish', () => {
    jest.useFakeTimers();
    const step = 50;
    const callback = jest.fn();
    render(
      <StaggeredEntrance delayStep={step} columns={1}>
        <KeyframesMotion
          animationTimingFunction={() => 'linear'}
          duration={duration}
          enteringAnimation={{}}
        >
          {props => <div {...props} />}
        </KeyframesMotion>
        <KeyframesMotion
          animationTimingFunction={() => 'linear'}
          duration={duration}
          enteringAnimation={{}}
          onFinish={callback}
        >
          {props => <div {...props} />}
        </KeyframesMotion>
      </StaggeredEntrance>,
    );

    // Step is actually logarithmic so we add a little on to make sure it hits the timeout.
    jest.runTimersToTime(duration + step + 2);

    expect(callback).toHaveBeenCalledWith('entering');
  });

  it('should take half the time to callback when exiting on finish', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const { rerender } = render(
      <ExitingPersistence>
        <KeyframesMotion
          animationTimingFunction={() => 'linear'}
          duration={duration}
          enteringAnimation={{}}
          onFinish={callback}
        >
          {props => <div {...props} />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );
    jest.runAllTimers();
    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    act(() => jest.runTimersToTime(duration * 0.5));

    expect(callback).toHaveBeenCalledWith('exiting');
  });

  it('should not callback if the component is fully unmounted when exiting', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const { rerender } = render(
      <ExitingPersistence>
        <KeyframesMotion
          animationTimingFunction={() => 'linear'}
          duration={duration}
          enteringAnimation={{}}
          onFinish={callback}
        >
          {props => <div {...props} />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );
    jest.runAllTimers();
    callback.mockReset();
    rerender(<span />);

    jest.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not callback if paused', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    render(
      <ExitingPersistence>
        <KeyframesMotion
          animationTimingFunction={() => 'linear'}
          duration={duration}
          enteringAnimation={{}}
          onFinish={callback}
          isPaused
        >
          {props => <div {...props} />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );
    jest.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });
});
