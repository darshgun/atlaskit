import {
  createEditorFactory,
  doc,
  expand,
  nestedExpand,
  table,
  tr,
  td,
  p,
  insertText,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  deleteExpand,
  insertExpand,
} from '../../../../plugins/expand/commands';

describe('expand actions', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        UNSAFE_allowExpand: true,
        quickInsert: true,
        allowTables: true,
      },
      createAnalyticsEvent,
    });
  };

  describe('expand', () => {
    it('fires analytics when inserted from quick insert', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '/expand', sel);
      sendKeyToPm(editorView, 'Enter');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'expand',
        attributes: {
          inputMethod: 'quickInsert',
        },
        eventType: 'track',
      });
    });

    it('fires analytics when inserted from insert menu', () => {
      const { editorView } = editor(doc(p('{<>}')));
      insertExpand(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'expand',
        attributes: {
          inputMethod: 'insertMenu',
        },
        eventType: 'track',
      });
    });

    it('fires analytics when deleted with floating toolbar', () => {
      const { editorView } = editor(doc(expand()(p('{<>}'))));

      deleteExpand()(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'expand',
        attributes: { inputMethod: 'toolbar' },
        eventType: 'track',
      });
    });
  });

  describe('nestedExpand', () => {
    it('fires analytics when inserted from quick insert', () => {
      const { editorView, sel } = editor(doc(table()(tr(td({})(p('{<>}'))))));
      insertText(editorView, '/expand', sel);
      sendKeyToPm(editorView, 'Enter');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'nestedExpand',
        attributes: {
          inputMethod: 'quickInsert',
        },
        eventType: 'track',
      });
    });

    it('fires analytics when inserted from insert menu', () => {
      const { editorView } = editor(doc(table()(tr(td({})(p('{<>}'))))));
      insertExpand(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'nestedExpand',
        attributes: {
          inputMethod: 'insertMenu',
        },
        eventType: 'track',
      });
    });

    it('fires analytics when deleted with floating toolbar', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(nestedExpand()(p('{<>}')))))),
      );

      deleteExpand()(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'nestedExpand',
        attributes: { inputMethod: 'toolbar' },
        eventType: 'track',
      });
    });
  });
});
