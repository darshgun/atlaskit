const mockCloseMediaAltTextMenu = jest.fn();
const mockUpdateAltText = jest.fn(() => jest.fn());

jest.mock('../../../../plugins/media/pm-plugins/alt-text/commands', () => ({
  closeMediaAltTextMenu: mockCloseMediaAltTextMenu,
  updateAltText: mockUpdateAltText,
}));

import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import AltTextEdit from '../../../../plugins/media/pm-plugins/alt-text/ui/AltTextEdit';

describe('AltTextEditComponent', () => {
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
      const wrapper = mountWithIntl(<AltTextEdit view={view} />);

      expect(wrapper.find('button[aria-label="Back"]').length).toEqual(1);
      wrapper.find('button[aria-label="Back"]').simulate('click');

      expect(mockCloseMediaAltTextMenu).toBeCalledWith(
        view.state,
        view.dispatch,
      );
    });
  });

  describe('when the esc key is pressed', () => {
    const KEY_CODE_ESCAPE = 27;

    it('should dispatch a handleKeyDown on the view', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} />);

      wrapper.find('input').simulate('keydown', { keyCode: KEY_CODE_ESCAPE });

      expect(view.someProp).toBeCalledWith(
        'handleKeyDown',
        expect.any(Function),
      );
    });
  });

  describe('when submit', () => {
    const KEY_CODE_ENTER = 13;

    it('should call updateAltText command with the input text value', () => {
      const view = new mockView();
      const wrapper = mountWithIntl(<AltTextEdit view={view} />);

      wrapper
        .find('input')
        // @ts-ignore
        .instance().value = 'ola como vai';

      wrapper.find('input').simulate('keydown', { keyCode: KEY_CODE_ENTER });

      expect(mockUpdateAltText).toBeCalledWith('ola como vai');
    });
  });
});
