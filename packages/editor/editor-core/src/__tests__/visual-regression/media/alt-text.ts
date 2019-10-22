import { snapshot, Appearance, initEditorWithAdf } from '../_utils';

import { insertMedia } from '../../__helpers/page-objects/_media';
import {
  clickEditableContent,
  clickElementWithText,
} from '../../__helpers/page-objects/_editor';
import { pressKey, pressKeyDown } from '../../__helpers/page-objects/_keyboard';
import { Page } from '../../__helpers/page-objects/_types';
import { EditorProps } from '../../../types';

describe('Snapshot Test: Media with alt text', () => {
  let page: Page;
  const initEditor = async (
    appearance: Appearance,
    viewport: { width: number; height: number },
    editorProps?: Partial<EditorProps>,
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      viewport,
      editorProps,
    });

    // click into the editor
    await clickEditableContent(page);
  };

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  describe('in the toolbar', () => {
    describe('when the feature flag is disabled', () => {
      it('should not display the alt text option', async () => {
        await initEditor(Appearance.fullPage, { width: 800, height: 700 });

        // insert single media item
        await insertMedia(page);
        await pressKey(page, 'ArrowUp');
        await snapshot(page);
      });
    });

    describe('when the feature flag is enable', () => {
      beforeEach(async () => {
        await initEditor(
          Appearance.fullPage,
          { width: 800, height: 700 },
          {
            media: {
              UNSAFE_allowAltTextOnImages: true,
            },
          },
        );

        // insert single media item
        await insertMedia(page);
        await pressKey(page, 'ArrowUp');
      });

      it('should display the alt text option', async () => {
        await snapshot(page);
      });

      describe('when the shortcut is pressed', () => {
        it('should display the alt text description', async () => {
          await pressKeyDown(page, 'Control');
          await pressKeyDown(page, 'Alt');
          await pressKeyDown(page, 'y');
          await snapshot(page);
        });
      });

      describe('when the alt text button is clicked', () => {
        it('should display the alt text description', async () => {
          await clickElementWithText({ page, tag: 'span', text: 'Alt text' });
          await snapshot(page);
        });
      });
    });
  });
});
