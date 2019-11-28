import {
  createEditorFactory,
  doc,
  mediaSingle,
  media,
  CreateEditorOptions,
  p,
} from '@atlaskit/editor-test-helpers';
import {
  updateAltText,
  openMediaAltTextMenu,
} from '../../../../plugins/media/pm-plugins/alt-text/commands';
import { getFreshMediaProvider } from '../media/_utils';
import { pluginKey as mediaEditorPluginKey } from '../../../../plugins/media/pm-plugins/media-editor';

import { MediaEditorState } from '../../../../plugins/media/types';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

describe('commands', () => {
  const createEditor = createEditorFactory<MediaEditorState>();
  const mediaProvider = getFreshMediaProvider();
  let createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
    () => ({ fire() {} } as UIAnalyticsEvent),
  );

  const editor = (doc: any, createEditorOptions?: CreateEditorOptions) => {
    return createEditor({
      ...createEditorOptions,
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        media: {
          allowAnnotation: true,
          allowMediaSingle: true,
          UNSAFE_allowAltTextOnImages: true,
          provider: mediaProvider,
        },
      },
      createAnalyticsEvent,
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

      it('fires analytics event on open alt text edit popup', () => {
        const { editorView } = editor(defaultDoc);
        openMediaAltTextMenu(editorView.state, editorView.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'alttext.opened',
          actionSubject: 'media',
          actionSubjectId: 'media',
          eventType: 'ui',
        });
      });
    });
  });
});
