import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adfWithMixedContent from './__fixtures__/mixed-content.adf.json';
import adfWithMedia from './__fixtures__/content-with-media.adf.json';
import adfWithBreakout from './__fixtures__/mixed-content-with-breakout.adf.json';
import adfWithHScrollContent from './__fixtures__/horizontal-scroll-content.adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { scrollToTop } from '../../__helpers/page-objects/_editor';

describe('Full-width mode', () => {
  let page: Page;

  const initEditor = async (adf: any, width = 2000, height = 800) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullWidth,
      adf,
      viewport: { width, height },
      withSidebar: true,
    });
  };

  // In full-width mode we cap the max-width at 1800px, for sizes greater than this the
  // content will be left-aligned. so we want to test a size < 1800 and a size > 1800
  const widths = [2000, 1200];
  widths.forEach(width => {
    describe(`(${width}px)`, () => {
      beforeEach(async () => {
        // @ts-ignore
        page = global.page;
      });

      it('should display content in full-width mode', async () => {
        await initEditor(adfWithMixedContent, width);
        await scrollToTop(page);
        await snapshot(page);
      });

      it('should not add horizontal scroll bars to page', async () => {
        // adf contains content that has caused editor to get too wide in the past
        await initEditor(adfWithHScrollContent, width, 1000);
        await snapshot(page);
      });

      describe(`with media`, () => {
        it('should display content in full-width mode', async () => {
          await initEditor(adfWithMedia, width);
          await snapshot(page);
        });
      });
    });
  });

  describe('breakout', () => {
    it('should disable breakout and ignore sizes', async () => {
      await initEditor(adfWithBreakout);
      await snapshot(page);
    });
  });
});
