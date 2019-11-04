import { EditorView } from 'prosemirror-view';
import {
  createEditorFactory,
  doc,
  mediaSingle,
  media,
  CreateEditorOptions,
  p,
} from '@atlaskit/editor-test-helpers';
import { updateAltText } from '../../../../plugins/media/pm-plugins/alt-text/commands';
import { getFreshMediaProvider } from '../media/_utils';
import { pluginKey as mediaEditorPluginKey } from '../../../../plugins/media/pm-plugins/media-editor';

import { MediaEditorState } from '../../../../plugins/media/types';

describe('commands', () => {
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

  describe('#updateAltText', () => {
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

    describe('when media is not selected', () => {
      const notSelectedMedia = doc(
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
      it('should returns false', () => {
        const { editorView } = editor(notSelectedMedia);

        expect(
          updateAltText(null)(editorView.state, editorView.dispatch),
        ).toBeFalsy();
      });
    });

    describe('when media is selected', () => {
      describe('when the new value is null', () => {
        it('should update the node attribute', () => {
          const { editorView } = editor(defaultDoc);

          updateAltText(null)(editorView.state, editorView.dispatch);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({
                layout: 'align-start',
              })(
                media({
                  id: 'abc',
                  type: 'file',
                  collection: 'xyz',
                })(),
              ),
            ),
          );
        });
      });

      it('should update the node attribute', () => {
        const { editorView } = editor(defaultDoc);

        updateAltText('lol')(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'align-start',
            })(
              media({
                id: 'abc',
                type: 'file',
                collection: 'xyz',
                alt: 'lol',
              })(),
            ),
          ),
        );
      });
    });
  });
});
