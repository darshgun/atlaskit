import { doc, createEditorFactory } from '@atlaskit/editor-test-helpers';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';
import { IntlProvider } from 'react-intl';
import { buildToolbar, messages } from '../../../../plugins/layout/toolbar';
import { EditorView } from 'prosemirror-view';
import {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '../../../../plugins/floating-toolbar/types';
import { MessageDescriptor, Command } from '../../../../types';
import commonMessages from '../../../../messages';
import { buildLayoutForWidths } from './_utils';
import { LAYOUT_TYPE } from '../../../../plugins/analytics/types/node-events';

describe('layout toolbar', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEventSignature;
  const createEditor = createEditorFactory();
  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    return createEditor({
      doc,
      editorProps: { allowLayouts: true, allowAnalyticsGASV3: true },
      createAnalyticsEvent,
    });
  };

  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();
  const stdLayoutButtons = [
    {
      name: LAYOUT_TYPE.TWO_COLS_EQUAL,
      message: messages.twoColumns,
    },
    { name: LAYOUT_TYPE.THREE_COLS_EQUAL, message: messages.threeColumns },
  ];
  const sidebarLayoutButtons = [
    { name: LAYOUT_TYPE.LEFT_SIDEBAR, message: messages.leftSidebar },
    { name: LAYOUT_TYPE.RIGHT_SIDEBAR, message: messages.rightSidebar },
    {
      name: LAYOUT_TYPE.THREE_WITH_SIDEBARS,
      message: messages.threeColumnsWithSidebars,
    },
  ];
  let editorView: EditorView;
  let toolbar: FloatingToolbarConfig;

  const findToolbarBtn = (
    toolbar: FloatingToolbarConfig,
    message: MessageDescriptor,
  ): FloatingToolbarButton<Command> =>
    toolbar.items.find(
      item =>
        item.type === 'button' && item.title === intl.formatMessage(message),
    ) as FloatingToolbarButton<Command>;

  beforeEach(() => {
    ({ editorView } = editor(doc(buildLayoutForWidths([50, 50], true))));
  });

  describe('with "addSidebarLayouts"', () => {
    beforeEach(() => {
      toolbar = buildToolbar(
        editorView.state,
        intl,
        0,
        true,
        true,
      ) as FloatingToolbarConfig;
    });

    it('displays all 5 layout buttons', () => {
      stdLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button.message)).toBeDefined();
      });
      sidebarLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button.message)).toBeDefined();
      });
    });

    it('displays delete button', () => {
      expect(findToolbarBtn(toolbar, commonMessages.remove)).toBeDefined();
    });
  });

  describe('without "addSidebarLayouts"', () => {
    beforeEach(() => {
      toolbar = buildToolbar(
        editorView.state,
        intl,
        0,
        true,
        false,
      ) as FloatingToolbarConfig;
    });

    it('displays only 2 original layout buttons', () => {
      stdLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button.message)).toBeDefined();
      });
      sidebarLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button.message)).not.toBeDefined();
      });
    });

    it('displays delete button', () => {
      expect(findToolbarBtn(toolbar, commonMessages.remove)).toBeDefined();
    });
  });

  describe('analytics', () => {
    beforeEach(() => {
      toolbar = buildToolbar(
        editorView.state,
        intl,
        0,
        true,
        true,
      ) as FloatingToolbarConfig;
    });

    [...stdLayoutButtons, ...sidebarLayoutButtons].forEach(button => {
      describe(`for "${button.name}" layout`, () => {
        let previousLayout: LAYOUT_TYPE;

        beforeEach(() => {
          previousLayout = LAYOUT_TYPE.TWO_COLS_EQUAL;

          // if we are testing clicking the 2 col btn (default layout), want to
          // select another layout first
          if (button.name === previousLayout) {
            previousLayout = LAYOUT_TYPE.THREE_COLS_EQUAL;
            findToolbarBtn(toolbar, messages.threeColumns).onClick(
              editorView.state,
              editorView.dispatch,
            );
          }

          findToolbarBtn(toolbar, button.message).onClick(
            editorView.state,
            editorView.dispatch,
          );
        });

        it('fires analytics event when click layout button', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'changedLayout',
            actionSubject: 'layout',
            attributes: {
              previousLayout,
              newLayout: button.name,
            },
            eventType: 'track',
          });
        });

        it('fires analytics event when click delete button', () => {
          findToolbarBtn(toolbar, commonMessages.remove).onClick(
            editorView.state,
            editorView.dispatch,
          );
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'deleted',
            actionSubject: 'layout',
            attributes: { layout: button.name },
            eventType: 'track',
          });
        });
      });
    });
  });
});
