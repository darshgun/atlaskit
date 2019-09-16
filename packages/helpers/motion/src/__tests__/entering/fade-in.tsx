import React from 'react';
import { mount } from 'enzyme';
import { easeInOut } from '../../utils/curves';
import FadeIn from '../../entering/fade-in';

describe('<FadeIn />', () => {
  it('should ease in for the timing curve', () => {
    const wrapper = mount(<FadeIn>{props => <div {...props} />}</FadeIn>);

    expect(wrapper).toHaveStyleDeclaration(
      'animation-timing-function',
      easeInOut,
    );
  });

  it('should set a default duration', () => {
    const wrapper = mount(<FadeIn>{props => <div {...props} />}</FadeIn>);

    expect(wrapper).toHaveStyleDeclaration('animation-duration', '700ms');
  });

  it('should override the default duration', () => {
    const wrapper = mount(
      <FadeIn duration={1234}>{props => <div {...props} />}</FadeIn>,
    );

    expect(wrapper).toHaveStyleDeclaration('animation-duration', '1234ms');
  });

  it('should fill the animation backwards so it starts hidden', () => {
    const wrapper = mount(<FadeIn>{props => <div {...props} />}</FadeIn>);

    expect(wrapper).toHaveStyleDeclaration('animation-fill-mode', 'backwards');
  });

  it('should respect reduced motion', () => {
    const wrapper = mount(<FadeIn>{props => <div {...props} />}</FadeIn>);

    expect(wrapper).toHaveStyleDeclaration('animation', 'none', {
      media: '(prefers-reduced-motion: reduce)',
    });
  });

  it('should default to playing the animation', () => {
    const wrapper = mount(<FadeIn>{props => <div {...props} />}</FadeIn>);

    expect(wrapper).toHaveStyleDeclaration('animation-play-state', 'running');
  });

  it('should pause the animation', () => {
    const wrapper = mount(
      <FadeIn isPaused>{props => <div {...props} />}</FadeIn>,
    );

    expect(wrapper).toHaveStyleDeclaration('animation-play-state', 'paused');
  });

  it('should not delay the animation by default', () => {
    const wrapper = mount(<FadeIn>{props => <div {...props} />}</FadeIn>);

    expect(wrapper).toHaveStyleDeclaration('animation-delay', '0ms');
  });

  it('should delay the animation', () => {
    const wrapper = mount(
      <FadeIn delay={100}>{props => <div {...props} />}</FadeIn>,
    );

    expect(wrapper).toHaveStyleDeclaration('animation-delay', '100ms');
  });
});
