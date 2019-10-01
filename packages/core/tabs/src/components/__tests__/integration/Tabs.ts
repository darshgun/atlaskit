import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const url = getExampleUrl('core', 'tabs', 'testing');

/* Css selectors used for the test */
const query = "[data-testid='the-tabs']";

BrowserTestCase(
  'Tabs should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const page = new Page(client);
    await page.goto(url);
    await page.waitFor(query, 5000);
    expect(await page.isVisible(query)).toBe(true);
    const selectedTabQuery = `[data-testid="tab-1"]`;
    await page.waitFor(selectedTabQuery, 5000);
    expect(await page.isVisible(selectedTabQuery)).toBe(true);
    expect(await page.getAttribute(selectedTabQuery, 'aria-selected')).toBe(
      'true',
    );
  },
);
