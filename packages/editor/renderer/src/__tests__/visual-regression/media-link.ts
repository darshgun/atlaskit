import { snapshot, initRendererWithADF } from './_utils';
import mediaLink from './__fixtures__/media-link.adf.json';
import { Page } from 'puppeteer';
import { defaultMediaLinkOpacity } from '../../react/marks/link';
import { mediaSingleClassName } from '@atlaskit/editor-common';

describe('media link:', () => {
  let page: Page;

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initRendererWithADF(page, {
      adf: mediaLink,
      appearance: 'full-page',
    });
  });

  it(`should have opacity ${defaultMediaLinkOpacity} when hover media link`, async () => {
    await page.waitForSelector('a:first-of-type');
    await page.hover('a:first-of-type');

    await page.waitForFunction(
      (selector, opacity) => {
        const element = document.querySelector(selector);
        if (element instanceof Element) {
          return (
            window
              .getComputedStyle(element, null)
              .getPropertyValue('opacity') === opacity
          );
        }
        return false;
      },
      {},
      `a:first-of-type > .${mediaSingleClassName}`,
      defaultMediaLinkOpacity,
    );

    await snapshot(page);
  });
});
