import React, { forwardRef } from 'react';
import { mount } from 'enzyme';
import { StaggeredEntrance } from '../../index';

describe('<StaggeredEntrance />', () => {
  const firstGroupDelay = 0;
  const secondGroupDelay = 52;
  const thirdGroupDelay = 83;
  const fourthGroupDelay = 104;
  const fifthGroupDelay = 121;

  it('should set a staggered duration for a list of elements', () => {
    const wrapper = mount(
      <StaggeredEntrance columns={1}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
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

    expect(wrapper.find('#top-left').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
    expect(wrapper.find('#top-mid').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#top-right').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
    expect(wrapper.find('#mid-left').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#mid-mid').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
    expect(wrapper.find('#mid-right').props()).toHaveProperty(
      'delay',
      fourthGroupDelay,
    );
    expect(wrapper.find('#bottom-left').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
    expect(wrapper.find('#bottom-mid').props()).toHaveProperty(
      'delay',
      fourthGroupDelay,
    );
    expect(wrapper.find('#bottom-right').props()).toHaveProperty(
      'delay',
      fifthGroupDelay,
    );
  });

  it('should set a staggered duration for the first column of a grid', () => {
    const wrapper = mount(
      <StaggeredEntrance column={0}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
  });

  it('should set a staggered duration for the second column of a grid', () => {
    const wrapper = mount(
      <StaggeredEntrance column={1}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      fourthGroupDelay,
    );
  });

  it('should set a staggered duration for the third column of a grid', () => {
    const wrapper = mount(
      <StaggeredEntrance column={2}>
        <div id="first" />
        <div id="second" />
        <div id="third" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      fourthGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      fifthGroupDelay,
    );
  });

  it('should render with no delay when there is only one child element', () => {
    const wrapper = mount(
      <StaggeredEntrance>
        <div id="first" />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
  });

  interface BoundingBox {
    offsetHeight: number;
    offsetLeft: number;
    offsetTop: number;
    offsetWidth: number;
  }

  const ListItem = forwardRef<
    HTMLElement,
    { id: string; box: Partial<BoundingBox> }
  >(({ box, ...props }, ref) => {
    if (typeof ref === 'function') ref(box as HTMLElement);
    return <div ref={...props as any} />;
  });

  it('should stagger over one column for a small viewport', () => {
    const wrapper = mount(
      <StaggeredEntrance>
        <ListItem id="first" box={{ offsetTop: 0 }} />
        <ListItem id="second" box={{ offsetTop: 50 }} />
        <ListItem id="third" box={{ offsetTop: 100 }} />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
  });

  it('should stagger over two columns for a medium viewport', () => {
    const wrapper = mount(
      <StaggeredEntrance>
        <ListItem id="first" box={{ offsetTop: 0 }} />
        <ListItem id="second" box={{ offsetTop: 0 }} />
        <ListItem id="third" box={{ offsetTop: 50 }} />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
  });

  it('should stagger over three columns for a large viewport', () => {
    const wrapper = mount(
      <StaggeredEntrance>
        <ListItem id="first" box={{ offsetTop: 0 }} />
        <ListItem id="second" box={{ offsetTop: 0 }} />
        <ListItem id="third" box={{ offsetTop: 0 }} />
      </StaggeredEntrance>,
    );

    expect(wrapper.find('#first').props()).toHaveProperty(
      'delay',
      firstGroupDelay,
    );
    expect(wrapper.find('#second').props()).toHaveProperty(
      'delay',
      secondGroupDelay,
    );
    expect(wrapper.find('#third').props()).toHaveProperty(
      'delay',
      thirdGroupDelay,
    );
  });
});
