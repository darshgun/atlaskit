import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const exampleUrl = getExampleUrl('core', 'checkbox', 'testing');

/* Css selectors used for the test */
const basicCheckboxQuery = "[data-testid='the-checkbox']";
// const customCheckboxQuery = "[data-testid='the-custom-checkbox']";

BrowserTestCase(
  'Checkbox should be able to be clicked by data-testid',
  {} as any,
  async (client: any) => {
    const testPage = new Page(client);
    await testPage.goto(exampleUrl);
    await testPage.waitFor(basicCheckboxQuery, 5000);
    await testPage.click(basicCheckboxQuery);
    const checkbox = await testPage.$(basicCheckboxQuery);
    const isChecked = checkbox.getProperty('checked');
    expect(isChecked).toBeDefined();
  },
);
