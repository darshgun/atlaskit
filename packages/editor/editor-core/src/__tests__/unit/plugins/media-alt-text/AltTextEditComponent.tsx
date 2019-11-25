const mockCloseMediaAltTextMenu = jest.fn();
const mockUpdateAltText = jest.fn(() => jest.fn());

jest.mock('../../../../plugins/media/pm-plugins/alt-text/commands', () => ({
  closeMediaAltTextMenu: mockCloseMediaAltTextMenu,
  updateAltText: mockUpdateAltText,
}));

import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import AltTextEdit, {
  AltTextEditComponent,
  AltTextEditComponentState,
} from '../../../../plugins/media/pm-plugins/alt-text/ui/AltTextEdit';
import { InjectedIntl } from 'react-intl';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '../../../../../../../core/analytics-next/src';
import { ReactWrapper } from 'enzyme';
let createAnalyticsEvent: CreateUIAnalyticsEvent;

describe('AltTextEditComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  });
  const mockView = jest.fn(
    () =>
      (({
        state: {},
        dispatch: jest.fn(),
        someProp: jest.fn(),
      } as { state: {}; dispatch: Function }) as EditorView),
  );

  describe('when the back button is clicked', () => {
    it('should call the closeMediaAltText command', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

      expect(wrapper.find('button[aria-label="Back"]').length).toEqual(1);
      wrapper.find('button[aria-label="Back"]').simulate('click');

      expect(mockCloseMediaAltTextMenu).toBeCalledWith(
        view.state,
        view.dispatch,
      );
      expect(mockUpdateAltText).not.toBeCalled();
    });

    describe('fires respective alt text analytics events', () => {
      const defaultMediaEvent = {
        action: 'alttext.edited',
        actionSubject: 'media',
        actionSubjectId: 'media',
        eventType: 'ui',
      };

      function setupWrapper(
        value: string,
      ): {
        view: EditorView<any>;
        wrapper: ReactWrapper<
          ReactIntl.InjectedIntlProps,
          AltTextEditComponentState,
          any
        >;
      } {
        const view = new mockView();
        const intl = {} as InjectedIntl;
        const wrapper = mountWithIntl<{}, AltTextEditComponentState>(
          <AltTextEditComponent
            view={view}
            value={value}
            intl={intl}
            createAnalyticsEvent={createAnalyticsEvent}
          />,
        );
        return { view, wrapper };
      }

      it('fires cleared and edited events after clearing value and closing popup editor', () => {
        const { wrapper } = setupWrapper('value');
        // @ts-ignore
        wrapper.setProps({ value: '' });

        wrapper.find('button[aria-label="Back"]').simulate('click');
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.cleared',
        });
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.edited',
        });
        expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.added',
        });
      });

      it('fires edited event after updating value and closing popup editor', () => {
        const { wrapper } = setupWrapper('value');
        // @ts-ignore
        wrapper.setProps({ value: 'test changed' });

        wrapper.find('button[aria-label="Back"]').simulate('click');
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.edited',
        });
        expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.cleared',
        });
        expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.added',
        });
      });

      it('fires added event after updating value and closing popup editor', () => {
        const { wrapper } = setupWrapper('');

        // @ts-ignore
        wrapper.setProps({ value: 'value added' });

        wrapper.find('button[aria-label="Back"]').simulate('click');
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.added',
        });
        expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.edited',
        });
        expect(createAnalyticsEvent).not.toHaveBeenCalledWith({
          ...defaultMediaEvent,
          action: 'alttext.cleared',
        });
      });
    });
  });

  describe('when the clear text button is clicked', () => {
    it('should clear alt text and not call the closeMediaAltText command', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

      expect(
        wrapper.find('button[aria-label="Clear alt text"]').length,
      ).toEqual(1);
      wrapper.find('button[aria-label="Clear alt text"]').simulate('click');

      expect(mockCloseMediaAltTextMenu).not.toBeCalled();
      expect(mockUpdateAltText).toBeCalledWith(null);
    });
  });

  describe('when the esc key is pressed', () => {
    const KEY_CODE_ESCAPE = 27;

    it('should dispatch a handleKeyDown on the view', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

      wrapper.find('input').simulate('keydown', { keyCode: KEY_CODE_ESCAPE });

      expect(view.someProp).toBeCalledWith(
        'handleKeyDown',
        expect.any(Function),
      );
      expect(mockUpdateAltText).not.toBeCalled();
    });
  });

  describe('when onChange is called', () => {
    it('should call updateAltText command with the input text value', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

      const input = wrapper.find('input');
      // @ts-ignore
      input.instance().value = 'newvalue';
      input.simulate('change');

      expect(mockUpdateAltText).toBeCalledWith('newvalue');
    });

    describe('when new value is empty string', () => {
      it('should set state showClearTextButton=false', () => {
        const view = new mockView();
        const wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

        expect(wrapper.state('showClearTextButton')).toBeTruthy();
        const input = wrapper.find('input');
        // @ts-ignore
        input.instance().value = '';
        input.simulate('change');

        expect(wrapper.state('showClearTextButton')).toBeFalsy();
      });
    });

    describe('when there was an empty string, and new text is nonempty', () => {
      it('should set state showClearTextButton=true', () => {
        const view = new mockView();
        const wrapper = mountWithIntl(<AltTextEdit view={view} />);

        expect(wrapper.state('showClearTextButton')).toBeFalsy();
        const input = wrapper.find('input');
        // @ts-ignore
        input.instance().value = 'newvalue';
        input.simulate('change');

        expect(wrapper.state('showClearTextButton')).toBeTruthy();
      });
    });
  });

  describe('when submit', () => {
    const KEY_CODE_ENTER = 13;

    it('should call updateAltText command with the input text value', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} value="test" />);

      wrapper.find('input').simulate('keydown', { keyCode: KEY_CODE_ENTER });

      expect(mockCloseMediaAltTextMenu).toBeCalledWith(
        view.state,
        view.dispatch,
      );
    });
  });
});
