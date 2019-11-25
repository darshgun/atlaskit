import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

// Css-selectors
const examples = '#examples';
const menu = "[data-testid='menu']";
const button1 = "[data-testid='button--1']";
const button2 = "[data-testid='button--2']";
const button3 = "[data-testid='button--3']";
const button4 = "[data-testid='button--4']";
const button5 = "[data-testid='button--5']";

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

  it('Motion example resizing height should match production example when adding 1 element', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button1);
    await page.click(button1);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load.
    await page.waitFor(500);
    // @ts-ignore custom properties on global are untyped
    const image = await takeElementScreenShot(page, menu);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Motion example resizing height should match production example when adding 2 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button2);
    await page.click(button2);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load.
    await page.waitFor(500);
    // @ts-ignore custom properties on global are untyped
    const image = await takeElementScreenShot(page, menu);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Motion example resizing height should match production example when adding 3 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button3);
    await page.click(button3);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load.
    await page.waitFor(500);
    // @ts-ignore custom properties on global are untyped
    const image = await takeElementScreenShot(page, menu);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Motion example resizing height should match production example when adding 4 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button4);
    await page.click(button4);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to load more elements.
    await page.waitFor(800);
    // @ts-ignore custom properties on global are untyped
    const image = await takeElementScreenShot(page, menu);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Motion example resizing height should match production example when adding 5 elements', async () => {
    await page.waitForSelector(examples);
    await page.waitForSelector(button5);
    await page.click(button5);
    await page.waitForSelector(menu);
    // The motionanimation takes 0.2s but due to the rendering it takes more time to more elements.
    await page.waitFor(800);
    // @ts-ignore custom properties on global are untyped
    const image = await takeElementScreenShot(page, menu);
    expect(image).toMatchProdImageSnapshot();
  });
});
