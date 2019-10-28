import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  let page: any;
  beforeEach(() => {
    // @ts-ignore
    page = global.page;
  });
  it('simple status', async () => {
    const url = getExampleUrl(
      'elements',
      'status',
      'simple-status',
      // @ts-ignore
      global.__BASEURL__,
    );
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, '#container');

    expect(image).toMatchProdImageSnapshot();
  });

  it('status picker', async () => {
    const url = getExampleUrl(
      'elements',
      'status',
      'status-picker',
      // @ts-ignore
      global.__BASEURL__,
    );

    await loadPage(page, url);

    const buttons = await page.$$('button');
    for (const button of buttons) {
      await button.click();
      const image = await takeElementScreenShot(page, '#container');
      expect(image).toMatchProdImageSnapshot();
    }
  });
});
