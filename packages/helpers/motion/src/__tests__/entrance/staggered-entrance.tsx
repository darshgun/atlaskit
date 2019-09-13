import React from 'react';
import { mount } from 'enzyme';
import { StaggeredEntrance } from '../../index';

describe('<StaggeredEntrance />', () => {
  it('should set a staggered duration for a list of elements', () => {
    const wrapper = mount(
      <StaggeredEntrance columns={1}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty('delay', 0);
    expect(wrapper.find('#second').props()).toHaveProperty('delay', 69);
    expect(wrapper.find('#third').props()).toHaveProperty('delay', 81);
  });

  it('should set a staggered duration for a grid of elements', () => {
    const wrapper = mount(
      <StaggeredEntrance columns={3}>
        <div id="top-left" />
        <div id="top-mid" />
        <div id="top-right" />
        <div id="mid-left" />
        <div id="mid-mid" />
        <div id="mid-right" />
        <div id="bottom-left" />
        <div id="bottom-mid" />
        <div id="bottom-right" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#top-left').props()).toHaveProperty('delay', 0);
    expect(wrapper.find('#top-mid').props()).toHaveProperty('delay', 69);
    expect(wrapper.find('#top-right').props()).toHaveProperty('delay', 81);
    expect(wrapper.find('#mid-left').props()).toHaveProperty('delay', 69);
    expect(wrapper.find('#mid-mid').props()).toHaveProperty('delay', 81);
    expect(wrapper.find('#mid-right').props()).toHaveProperty('delay', 118);
    expect(wrapper.find('#bottom-left').props()).toHaveProperty('delay', 81);
    expect(wrapper.find('#bottom-mid').props()).toHaveProperty('delay', 118);
    expect(wrapper.find('#bottom-right').props()).toHaveProperty('delay', 138);
  });

  it('should set a staggered duration for the first column of a grid', () => {
    const wrapper = mount(
      <StaggeredEntrance column={0}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty('delay', 0);
    expect(wrapper.find('#second').props()).toHaveProperty('delay', 69);
    expect(wrapper.find('#third').props()).toHaveProperty('delay', 81);
  });

  it('should set a staggered duration for the second column of a grid', () => {
    const wrapper = mount(
      <StaggeredEntrance column={1}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty('delay', 69);
    expect(wrapper.find('#second').props()).toHaveProperty('delay', 81);
    expect(wrapper.find('#third').props()).toHaveProperty('delay', 118);
  });

  it('should set a staggered duration for the third column of a grid', () => {
    const wrapper = mount(
      <StaggeredEntrance column={2}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty('delay', 81);
    expect(wrapper.find('#second').props()).toHaveProperty('delay', 118);
    expect(wrapper.find('#third').props()).toHaveProperty('delay', 138);
  });

  xit('should dynamically calculate how many columns there are for a small viewport', () => {});

  xit('should dynamically calculate how many columns there are for a medium viewport', () => {});

  xit('should dynamically calculate how many columns there are for a large viewport', () => {});

  xit('should only calculate columns once on initial mount', () => {});
});
