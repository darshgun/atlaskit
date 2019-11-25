import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

// Css-selectors
const menu = "[data-testid='menu']";
const examples = '#examples';

describe('Snapshot Test', () => {
  let page: any;
  let url: string;

  beforeAll(async () => {
    // @ts-ignore custom properties on global are untyped
    page = global.page;
    url = getExampleUrl(
      'helpers',
      'motion',
      'resizing-height',
      // @ts-ignore custom properties on global are untyped
      global.__BASEURL__,
    );
    await page.goto(url);
  });

  it('Motion example resizing height should match production example when adding a new element', async () => {
    await page.waitForSelector(examples);
    for (let i = 1; i <= 5; i++) {
      const button = `[data-testid="button--${i}"]`;
      await page.waitForSelector(button);
      await page.click(button);
      // The motionanimation takes 0.2s
      await page.waitFor(500);
      // @ts-ignore custom properties on global are untyped
      const image = await takeElementScreenShot(page, menu);
      expect(image).toMatchProdImageSnapshot();
    }
  });
});
