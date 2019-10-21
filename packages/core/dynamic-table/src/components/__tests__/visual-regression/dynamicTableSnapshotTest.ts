import {
  getExampleUrl,
  takeScreenShot,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const table = "[data-testid='the-table--table']";
const tableHeadCell = "[data-testid='the-table--head--cell']";
const tableHeadParty = `${tableHeadCell}:nth-child(2)`;

describe('Snapshot Test', () => {
  // You can't use other example as they create dynamic content and will fail the test
  it('Empty view example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'dynamic-table',
      'empty-view-with-body',
      // @ts-ignore - Property '__BASEURL__' does not exist on type 'Global'.
      global.__BASEURL__,
    );
    // @ts-ignore - Property '__BASEURL__' does not exist on type 'Global'.
    const { page } = global;

    const image = await takeScreenShot(page, url);
    // @ts-ignore - Expected 0 arguments, but got 1.
    expect(image).toMatchProdImageSnapshot(0.02);
  });
  it('Testing example should match production example before and after sorting', async () => {
    const url = getExampleUrl(
      'core',
      'dynamic-table',
      'testing',
      // @ts-ignore - Property '__BASEURL__' does not exist on type 'Global'.
      global.__BASEURL__,
    );
    // @ts-ignore - Property '__BASEURL__' does not exist on type 'Global'.
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(table);
    // Take screenshot before sorting
    // We need to wait for the animation to finish.
    await page.waitFor(1000);
    // @ts-ignore - Property 'page' does not exist on type 'Global'.
    const tableBefore = await takeElementScreenShot(page, table);
    expect(tableBefore).toMatchProdImageSnapshot();
    // Take screenshot after sorting
    await page.waitForSelector(tableHeadCell);
    await page.click(tableHeadParty);
    const tableAfter = await takeElementScreenShot(page, table);
    expect(tableAfter).toMatchProdImageSnapshot();
  });
});
