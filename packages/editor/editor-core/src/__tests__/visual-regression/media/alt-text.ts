import { snapshot, Appearance, initEditorWithAdf } from '../_utils';

import {
  insertMedia,
  waitForMediaToBeLoaded,
  clickMediaInPosition,
  scrollToMedia,
} from '../../__helpers/page-objects/_media';
import {
  clickEditableContent,
  clickElementWithText,
  animationFrame,
} from '../../__helpers/page-objects/_editor';
import {
  pressKey,
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';
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

  beforeEach(() => {
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

        await waitForMediaToBeLoaded(page);
        await scrollToMedia(page);
        await clickMediaInPosition(page, 0);
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
          await pressKeyUp(page, 'Control');
          await pressKeyUp(page, 'Alt');
          await pressKeyUp(page, 'y');
        });
      });

      describe('when the alt text button is clicked', () => {
        it('should display the alt text description', async () => {
          await clickElementWithText({ page, tag: 'span', text: 'Alt text' });
          await snapshot(page);
        });
      });

      describe('when the user adds an alt text value', () => {
        it('should display the clear alt text button', async () => {
          await clickElementWithText({ page, tag: 'span', text: 'Alt text' });
          await page.waitForSelector(
            '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
          );
          await animationFrame(page);
          await pressKey(page, 'y');
          await snapshot(page);
        });

        it('should clear alt text when the user click the alt text button', async () => {
          await clickElementWithText({ page, tag: 'span', text: 'Alt text' });
          await page.waitForSelector(
            '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
          );
          await animationFrame(page);
          await pressKey(page, 'y');

          await page.waitForSelector('button[aria-label="Clear alt text"]');
          await page.click('button[aria-label="Clear alt text"]');
          await animationFrame(page);
          await snapshot(page);
        });
      });
    });
  });
});
