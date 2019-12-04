import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Modal Basic example should match production example', async () => {
    const { __BASEURL__, page } = global as any;
    const url = getExampleUrl('core', 'onboarding', 'modal-basic', __BASEURL__);

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });
});
