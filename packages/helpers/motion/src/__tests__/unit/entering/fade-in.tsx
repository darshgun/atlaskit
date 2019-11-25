import React from 'react';
import { render } from '@testing-library/react';
import { easeInOut } from '../../../utils/curves';
import FadeIn from '../../../entering/fade-in';

describe('<FadeIn />', () => {
  it('should ease in for the timing curve', () => {
    const { getByTestId } = render(
      <FadeIn>{props => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-timing-function',
      easeInOut,
    );
  });

  it('should set a default duration', () => {
    const { getByTestId } = render(
      <FadeIn>{props => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-duration',
      '700ms',
    );
  });

  it('should override the default duration', () => {
    const { getByTestId } = render(
      <FadeIn duration={1234}>
        {props => <div data-testid="element" {...props} />}
      </FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-duration',
      '1234ms',
    );
  });

  it('should fill the animation backwards so it starts hidden', () => {
    const { getByTestId } = render(
      <FadeIn>{props => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-fill-mode',
      'backwards',
    );
  });

  it('should respect reduced motion', () => {
    const { getByTestId } = render(
      <FadeIn>{props => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration('animation', 'none', {
      media: '(prefers-reduced-motion: reduce)',
    });
  });

  it('should default to playing the animation', () => {
    const { getByTestId } = render(
      <FadeIn>{props => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-play-state',
      'running',
    );
  });

  it('should not delay the animation by default', () => {
    const { getByTestId } = render(
      <FadeIn>{props => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-delay',
      '0ms',
    );
  });
});
