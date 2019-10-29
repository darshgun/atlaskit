import { Device, snapshot, initFullPageEditorWithAdf } from '../_utils';
import { expandADF } from './__fixtures__/expand-adf';
import { selectors } from '../../__helpers/page-objects/_expand';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { Page } from '../../__helpers/page-objects/_types';

describe('Expand: full-page', () => {
  let page: Page;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.expand);
  });

  describe.each(['default', 'wide', 'full-width'])('Breakout: %s', mode => {
    test(`should render a ${mode} collapsed top level expand`, async () => {
      await initFullPageEditorWithAdf(page, expandADF(mode), Device.LaptopMDPI);
    });
  });

  test('should collapse the top level expand on click', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.click(selectors.expandToggle);
  });

  test('should render a border on hover of a collapsed top level expand', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    // Hide the tooltip
    const css = `
      .Tooltip {
        opacity: 0 !important;
      }
    `;
    await page.addStyleTag({ content: css });
    await page.click(selectors.expandToggle);
    await page.hover(selectors.expandTitleInput);
  });

  test.skip('should collapse a nested expand on click', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.click(selectors.nestedExpandToggle);
    await animationFrame(page);
  });
});
