import * as React from 'react';

jest.mock('../src/utils/breakpoint');

import { shallow, mount } from 'enzyme';
import { FileDetails, LinkDetails } from '@atlaskit/media-core';

import { Retry } from '../src/utils/cardGenericViewSmall/styled';
import {
  CardView,
  CardViewWithAnalyticsEvents,
  CardViewBase,
  CardViewOwnProps,
} from '../src/root/cardView';
import { LinkCard } from '../src/links';
import { FileCard } from '../src/files';
import { Wrapper } from '../src/root/styled';
import { breakpointSize } from '../src/utils/breakpoint';

describe('CardView', () => {
  const file: FileDetails = {
    id: 'abcd',
    name: 'my-file',
  };
  const link: LinkDetails = {
    id: 'abcd',
    type: 'wha',
    url: 'https://example.com',
    title: 'foobar',
  };
  let createAnalyticsEventMock;
  beforeEach(() => {
    createAnalyticsEventMock = jest.fn();
  });

  const shallowCardViewBaseElement = (
    props: Partial<CardViewOwnProps>,
    renderOptions = {},
  ) =>
    shallow(
      <CardViewBase
        mediaItemType={props.metadata === link ? 'link' : 'file'}
        createAnalyticsEvent={createAnalyticsEventMock}
        status="loading"
        {...props}
      />,
      renderOptions,
    );

  it('should render FileCard when no metadata is passed', () => {
    const element = shallow(<CardView status="loading" appearance="small" />);
    const fileCard = element
      .find(CardViewWithAnalyticsEvents)
      .dive()
      .find(CardViewBase)
      .dive()
      .find(FileCard);
    expect(fileCard).toHaveLength(1);
  });

  it('should render LinkCard with details', () => {
    const element = shallowCardViewBaseElement({ metadata: link });

    const linkCard = element.find(LinkCard);
    expect(linkCard).toHaveLength(1);
    expect(linkCard.props().details).toBe(link);
  });

  it('should render LinkCard with other props', () => {
    const element = shallowCardViewBaseElement({
      metadata: link,
      appearance: 'small',
    });

    const linkCard = element.find(LinkCard);
    expect(linkCard).toHaveLength(1);
    expect(linkCard.prop('appearance')).toBe('small');
  });

  it('should render FileCard with details', () => {
    const element = shallowCardViewBaseElement({ metadata: file });

    const card = element.find(FileCard);
    expect(card).toHaveLength(1);
    expect(card.props().details).toBe(file);
  });

  it('should render FileCard with other props', () => {
    const element = shallowCardViewBaseElement({
      metadata: file,
      appearance: 'small',
    });

    const fileCard = element.find(FileCard);
    expect(fileCard).toHaveLength(1);
    expect(fileCard.prop('appearance')).toBe('small');
  });

  it('should render LinkCard and NOT use details to determine which card to render when mediaItemType is "link"', () => {
    const element = shallowCardViewBaseElement({
      metadata: file,
      mediaItemType: 'link',
    });

    const linkCard = element.find(LinkCard);
    expect(linkCard).toHaveLength(1);
  });

  it('should render FileCard and NOT use details to determine which card to render when mediaItemType is "file"', () => {
    const element = shallowCardViewBaseElement({
      metadata: link,
      mediaItemType: 'file',
    });

    const linkCard = element.find(FileCard);
    expect(linkCard).toHaveLength(1);
  });

  it('should fire onClick and onMouseEnter events when file details are passed in', () => {
    const clickHandler = jest.fn();
    const hoverHandler = jest.fn();
    const card = mount(
      <CardView
        status="loading"
        metadata={file}
        onClick={clickHandler}
        onMouseEnter={hoverHandler}
      />,
    );

    card.simulate('click');
    card.simulate('mouseEnter');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    const clickHandlerArg = clickHandler.mock.calls[0][0];
    expect(clickHandlerArg.mediaItemDetails).toEqual(file);

    expect(hoverHandler).toHaveBeenCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(file);
  });

  it('should fire onClick and onMouseEnter events when link details are passed in', () => {
    const clickHandler = jest.fn();
    const hoverHandler = jest.fn();
    const card = mount(
      <CardView
        status="loading"
        metadata={link}
        onClick={clickHandler}
        onMouseEnter={hoverHandler}
      />,
    );

    card.simulate('click');
    card.simulate('mouseEnter');

    expect(clickHandler).toHaveBeenCalledTimes(1);
    const clickHandlerArg = clickHandler.mock.calls[0][0];
    expect(clickHandlerArg.mediaItemDetails).toEqual(link);

    expect(hoverHandler).toHaveBeenCalledTimes(1);
    const hoverHandlerArg = hoverHandler.mock.calls[0][0];
    expect(hoverHandlerArg.mediaItemDetails).toEqual(link);
  });

  it('should render retry element for small cards when an error occurs', () => {
    const onRetryHandler = jest.fn();
    const linkCard = mount(
      <CardView
        status="error"
        appearance="small"
        metadata={link}
        onRetry={onRetryHandler}
      />,
    );
    const fileCard = mount(
      <CardView
        status="error"
        appearance="small"
        metadata={file}
        onRetry={onRetryHandler}
      />,
    );

    expect(linkCard.find(Retry)).toHaveLength(1);
    expect(fileCard.find(Retry)).toHaveLength(1);
  });

  it('should NOT fire onSelectChange when card is NOT selectable', () => {
    const handler = jest.fn();
    const element = shallowCardViewBaseElement({
      metadata: file,
      onSelectChange: handler,
    });
    element.setProps({ selected: true });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should fire onSelectChange when selected state is changed by the consumer and selectable is true', () => {
    const handler = jest.fn();
    const element = shallowCardViewBaseElement({
      metadata: file,
      onSelectChange: handler,
      selectable: true,
    });
    element.setProps({ selected: true });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      selected: true,
      mediaItemDetails: file,
    });
  });

  it('should render a cropped image by default', () => {
    const card = mount(
      <CardView status="complete" dataURI="a" metadata={file} />,
    );

    expect(card.find('MediaImage').prop('crop')).toBe(true);
  });

  it('should render not render a cropped image if we specify a different resizeMode', () => {
    const card = mount(
      <CardView
        status="complete"
        dataURI="a"
        metadata={file}
        resizeMode="full-fit"
      />,
    );

    expect(card.find('MediaImage').prop('crop')).toBe(false);
  });

  describe('Dimensions', () => {
    it('should render wrapper with correct breakpoint size', () => {
      const dimensions = { width: '100%', height: '50%' };

      (breakpointSize as jest.Mock<void>).mockReturnValue('small');
      const element = shallowCardViewBaseElement(
        {
          status: 'complete',
          metadata: file,
          dimensions,
        },
        { disableLifecycleMethods: true },
      );
      expect(breakpointSize).toHaveBeenCalledWith('100%');

      expect(element.find(Wrapper).props().breakpointSize).toEqual('small');
    });

    it('should render wrapper with default dimensions based on default appearance when dimensions and appearance are not provided', () => {
      const element = shallowCardViewBaseElement({
        status: 'complete',
        metadata: file,
      });
      expect(element.find(Wrapper).props().dimensions).toEqual({
        width: 156,
        height: 125,
      });
    });

    it('should use default dimensions based on passed appearance', () => {
      const element = shallowCardViewBaseElement({
        status: 'complete',
        metadata: file,
        appearance: 'small',
      });
      expect(element.find(Wrapper).props().dimensions).toEqual({
        width: '100%',
        height: 42,
      });
    });

    it('should use passed dimensions when provided', () => {
      const element = shallowCardViewBaseElement(
        {
          status: 'complete',
          metadata: file,
          appearance: 'small',
          dimensions: { width: '70%', height: 100 },
        },
        { disableLifecycleMethods: true },
      );

      expect(element.find(Wrapper).props().dimensions).toEqual({
        width: '70%',
        height: 100,
      });
    });

    it('should use item type to calculate default dimensions', () => {
      const element = shallowCardViewBaseElement({
        status: 'complete',
        metadata: file,
      });
      const props = element.find(Wrapper).props();

      expect(props.dimensions).toEqual({
        width: 156,
        height: 125,
      });
      expect(props.mediaItemType).toEqual('file');
    });

    it('should not use default dimensions for link cards', () => {
      const linkCard = shallowCardViewBaseElement({
        status: 'complete',
        metadata: link,
      });

      expect(linkCard.find(Wrapper).props().dimensions).toEqual(undefined);
    });
  });
});
