import { getExampleUrl } from '@atlaskit/visual-regression/helper';

const button = '#popup-trigger';
const spinner = '#spinner';
const popup = '#popup-content';
const button0 = '[name="Button 0"]';

describe('Snapshot Test', () => {
  it('it should match visual snapshot for popup', async () => {
    const url = getExampleUrl(
      'core',
      'popup',
      'popup',
      // @ts-ignore
      global.__BASEURL__,
    );

    // @ts-ignore
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(button);

    await page.click(button);
    // We need to wait for the active state animation to finish.
    await page.waitFor(500);
    await page.waitForSelector(popup);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('it should match visual snapshot for async popup', async () => {
    const url = getExampleUrl(
      'core',
      'popup',
      'asynchronous-popup',
      // @ts-ignore
      global.__BASEURL__,
    );

    // @ts-ignore
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(button);

    await page.click(button);
    await page.waitForSelector(spinner);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
    // We need to wait for the active state animation to finish.
    await page.waitFor(500);
    await page.waitForSelector(popup);
    const imageWithContent = await page.screenshot();
    expect(imageWithContent).toMatchProdImageSnapshot();
  });

  it('it should match visual snapshot for setting focus', async () => {
    const url = getExampleUrl(
      'core',
      'popup',
      'setting-focus',
      // @ts-ignore
      global.__BASEURL__,
    );

    // @ts-ignore
    const { page } = global;

    await page.goto(url);
    await page.waitFor(button);
    // We need to wait for the active state animation to finish.
    await page.waitFor(500);
    await page.click(button);
    await page.waitForSelector(popup);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();

    await page.click(button);
    await page.click(button0);
    await page.click(button);
    await page.waitForSelector(popup);
    // We need to wait for the active state animation to finish.
    await page.waitFor(500);
    const imageWithFocus = await page.screenshot();
    expect(imageWithFocus).toMatchProdImageSnapshot();
  });
});
