import { EditorView } from 'prosemirror-view';
import {
  createEditorFactory,
  doc,
  mediaSingle,
  media,
  CreateEditorOptions,
  p,
  Refs,
} from '@atlaskit/editor-test-helpers';

import { getFreshMediaProvider } from '../media/_utils';
import { pluginKey as mediaEditorPluginKey } from '../../../../plugins/media/pm-plugins/media-editor';

import { MediaEditorState } from '../../../../plugins/media/types';
import {
  openMediaAltTextMenu,
  closeMediaAltTextMenu,
} from '../../../../plugins/media/pm-plugins/alt-text/commands';
import { getPluginState } from '../../../../plugins/media/pm-plugins/alt-text';
import { setGapCursorSelection } from '../../../../utils';
import { Side } from '../../../../plugins/gap-cursor';

describe('media alt text', () => {
  const createEditor = createEditorFactory<MediaEditorState>();

  const mediaProvider = getFreshMediaProvider();

  const editor = (doc: any, createEditorOptions?: CreateEditorOptions) => {
    return createEditor({
      ...createEditorOptions,
      doc,
      editorProps: {
        media: {
          allowAnnotation: true,
          allowMediaSingle: true,
          UNSAFE_allowAltTextOnImages: true,
          provider: mediaProvider,
        },
      },
      pluginKey: mediaEditorPluginKey,
    });
  };

  describe('when the media is selected', () => {
    let view: EditorView;
    const defaultDoc = doc(
      '{<node>}',
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
    );

    beforeEach(() => {
      const { editorView } = editor(defaultDoc);
      view = editorView;
    });

    it('should set isAltTextEditorOpen as true', () => {
      getPluginState(view.state).isAltTextEditorOpen = false;
      openMediaAltTextMenu(view.state, view.dispatch);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeTruthy();
    });

    it('should set isAltTextEditorOpen as false', () => {
      getPluginState(view.state).isAltTextEditorOpen = true;
      closeMediaAltTextMenu(view.state, view.dispatch);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
    });
  });

  describe('when the media is not selected', () => {
    let view: EditorView;
    const defaultDoc = doc(
      p('Nothing {<>}here'),
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
    );

    beforeEach(() => {
      const { editorView } = editor(defaultDoc);
      view = editorView;
    });
    it('should not set isAltTextEditorOpen as true', () => {
      getPluginState(view.state).isAltTextEditorOpen = false;
      openMediaAltTextMenu(view.state, view.dispatch);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
    });
  });

  describe('when the selection change', () => {
    let view: EditorView;
    let refs: Refs;
    const defaultDoc = doc(
      '{<node>}',
      mediaSingle({
        layout: 'align-start',
      })(
        media({
          id: 'abc',
          type: 'file',
          collection: 'xyz',
        })(),
      ),
      p('Nothing {nextPos}here'),
    );

    beforeEach(() => {
      const { editorView, refs: tmp } = editor(defaultDoc);
      view = editorView;
      refs = tmp;
    });

    it('should set isAltTextEditorOpen to false', () => {
      getPluginState(view.state).isAltTextEditorOpen = true;

      setGapCursorSelection(view, refs.nextPos, Side.RIGHT);

      expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
    });

    describe('to another media single', () => {
      beforeEach(() => {
        const { editorView, refs: tmp } = editor(
          doc(
            '{<node>}',
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'abc',
                type: 'file',
                collection: 'xyz',
              })(),
            ),
            p('Nothing here'),
            '{nextPos}',
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'cde',
                type: 'file',
                collection: 'xyz',
              })(),
            ),
          ),
        );
        view = editorView;
        refs = tmp;
      });
      it('should set isAltTextEditorOpen to false', () => {
        getPluginState(view.state).isAltTextEditorOpen = true;

        setGapCursorSelection(view, refs.nextPos, Side.RIGHT);

        expect(getPluginState(view.state).isAltTextEditorOpen).toBeFalsy();
      });
    });
  });
});
