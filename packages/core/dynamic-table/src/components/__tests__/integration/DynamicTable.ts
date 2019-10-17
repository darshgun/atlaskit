// TODO: to add an integration test.
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlDynamicTable = getExampleUrl('core', 'dynamic-table', 'testing');

/* Css selectors used for the test */
// const dynamicTableBtn = "[data-testid='the-button-for-dynamic-table']";
// const dynamicTableTestId = "[data-testid='the-dynamic-table']";

BrowserTestCase(
  'DynamicTable should be able to be identified and clicked by data-testid',
  {} as any,
  async (client: any) => {
    const dynamicTableTest = new Page(client);
    await dynamicTableTest.goto(urlDynamicTable);
  },
);
SORT;
SELECT;
