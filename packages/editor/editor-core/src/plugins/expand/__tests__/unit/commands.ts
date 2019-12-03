import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, expand } from '@atlaskit/editor-test-helpers/schema-builder';
import { toggleExpandExpanded } from '../../commands';

describe('Expand Commands', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        UNSAFE_allowExpand: true,
      },
    });
  };

  describe('toggleExpandExpanded()', () => {
    it('should move to right gap cursor if selection is inside the expand when collapsing', () => {
      const { editorView, refs } = editor(
        doc('{expandPos}', expand()(p('{<>}'))),
      );
      const { state, dispatch } = editorView;

      toggleExpandExpanded(refs.expandPos, state.schema.nodes.expand)(
        state,
        dispatch,
      );

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(expand({ __expanded: false })(p('')), '{<|gap>}'),
      );
    });

    it('should leave selection along if outside the expand when collapsing', () => {
      const { editorView, refs } = editor(
        doc(p('Hello!{<>}'), '{expandPos}', expand()(p())),
      );
      const { state, dispatch } = editorView;

      toggleExpandExpanded(refs.expandPos, state.schema.nodes.expand)(
        state,
        dispatch,
      );

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('Hello!{<>}'), expand({ __expanded: false })(p())),
      );
    });
  });
});
