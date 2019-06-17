import * as React from 'react';
import Button from '@atlaskit/button';
import {
  ShowMoreButton,
  ShowMoreButtonProps,
} from '../../components/ShowMoreButton';
import { AnalyticsNextEvent } from '../../components/analytics/types';
import * as Utils from '../../components/SearchResultsUtil';
import { shallow } from 'enzyme';

const mockedEvent = ({
  payload: {},
  update: jest.fn(),
  fire: jest.fn(),
} as {}) as AnalyticsNextEvent;

const createAnalyticsEventSpy = jest.fn();
const showMoreClickSpy = jest.fn();
const onSearchMoreAdvancedSearchSpy = jest.fn();

const render = (changedProps: Partial<ShowMoreButtonProps>) => {
  const props = ({
    onShowMoreClicked: showMoreClickSpy,
    onSearchMoreAdvancedSearch: onSearchMoreAdvancedSearchSpy,
    query: 'query',
    createAnalyticsEvent: createAnalyticsEventSpy,
    ...changedProps,
  } as unknown) as ShowMoreButtonProps;
  return shallow(<ShowMoreButton {...props} />);
};

const advancedLink = 'advanced_link';

describe('Show more button', () => {
  let getConfluenceAdvancedSearchLinkSpy: jest.SpyInstance;

  beforeEach(() => {
    getConfluenceAdvancedSearchLinkSpy = jest.spyOn(
      Utils,
      'getConfluenceAdvancedSearchLink',
    );
    getConfluenceAdvancedSearchLinkSpy.mockReturnValue(advancedLink);
    createAnalyticsEventSpy.mockReturnValue(mockedEvent);
    mockedEvent.update.mockReturnValue(mockedEvent);
  });

  afterEach(() => {
    getConfluenceAdvancedSearchLinkSpy.mockRestore();
    jest.resetAllMocks();
  });

  it('should render nothing if total size is less than current size', () => {
    const wrapper = render({ totalSize: 2, resultLength: 10 });
    const button = wrapper.find(Button);
    expect(button.length).toBe(0);
  });

  it('should render show more button link', () => {
    const wrapper = render({ totalSize: 102, resultLength: 10 });
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    const buttonProps = button.props();
    expect(buttonProps).toMatchObject({
      onClick: expect.any(Function),
    });
    expect(buttonProps).not.toHaveProperty('href');
    expect(getConfluenceAdvancedSearchLinkSpy).not.toBeCalled();
  });

  it('should display advanced link', () => {
    const wrapper = render({ totalSize: 105, resultLength: 101 });
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    const buttonProps = button.props();
    expect(buttonProps).toMatchObject({
      onClick: expect.any(Function),
      href: advancedLink,
    });
    expect(getConfluenceAdvancedSearchLinkSpy).toBeCalledTimes(1);
    expect(getConfluenceAdvancedSearchLinkSpy.mock.calls[0][0]).toBe('query');
  });

  it('should trigger show more analytic event', () => {
    const wrapper = render({ totalSize: 102, resultLength: 10 });
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    button.simulate('click');

    expect(showMoreClickSpy).toBeCalledTimes(1);
    expect(onSearchMoreAdvancedSearchSpy).not.toBeCalled();

    expect(mockedEvent.update).toBeCalledTimes(1);
    expect(mockedEvent.update.mock.calls[0][0]).toMatchObject({
      action: 'click',
      actionSubject: 'button',
      actionSubjectId: 'show_more_button',
      eventType: 'ui',
      source: 'globalSearchDrawer',
      attributes: {
        searchSessionId: undefined,
        currentSize: 10,
        totalResultSize: 102,
        packageName: 'global-search',
        packageVersion: '0.0.0',
        componentName: 'GlobalQuickSearch',
      },
    });
    expect(mockedEvent.fire).toBeCalledTimes(1);
    expect(mockedEvent.fire.mock.calls[0][0]).toBe('fabric-elements');
  });

  it('should trigger advanced link analytic event', () => {
    const wrapper = render({ totalSize: 102, resultLength: 101 });
    const button = wrapper.find(Button);
    expect(button.length).toBe(1);
    button.simulate('click');

    expect(showMoreClickSpy).toBeCalledTimes(0);
    expect(onSearchMoreAdvancedSearchSpy).toBeCalledTimes(1);

    expect(mockedEvent.update).toBeCalledTimes(1);
    expect(mockedEvent.update.mock.calls[0][0]).toMatchObject({
      action: 'click',
      actionSubject: 'button',
      actionSubjectId: 'show_more_advanced_search_button',
      eventType: 'ui',
      source: 'globalSearchDrawer',
      attributes: {
        searchSessionId: undefined,
        currentSize: 101,
        totalResultSize: 102,
        packageName: 'global-search',
        packageVersion: '0.0.0',
        componentName: 'GlobalQuickSearch',
      },
    });
    expect(mockedEvent.fire).toBeCalledTimes(1);
    expect(mockedEvent.fire.mock.calls[0][0]).toBe('fabric-elements');
  });
});
