import { createEditorFactory, doc, p } from '@atlaskit/editor-test-helpers';

import { getEditorProps } from '../../../../plugins/shared-context';

describe('shared context plugin', () => {
  const createEditor = createEditorFactory();
  const editorProps = {
    // setting some random props
    allowNewInsertionBehaviour: true,
    allowTextAlignment: false,
    allowPanel: true,
    allowTables: true,
  };

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps,
    });
  };

  describe('getEditorProps', () => {
    it('should return editor props', () => {
      const { editorView } = editor(doc(p()));
      expect(getEditorProps(editorView.state)).toBe(editorProps);
    });
  });
});
