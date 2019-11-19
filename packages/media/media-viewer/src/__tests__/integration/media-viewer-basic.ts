import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';

BrowserTestCase(
  'media-viewer-basic.ts: Navigation should navigate back and forth',
  { skip: [] },
  async (client: any, testName: string) => {
    const validateNameTypeAndIcon = async (
      name: string,
      type: string,
      icon: string,
    ) => {
      await page.waitForSelector(`div=${name}`);
      await page.waitForSelector(
        `//div[text()='${name}']/../div/span[text()='${type}']`,
      );
      await page.waitForSelector(
        `//span[@aria-label='media-type']/ancestor::div[@type='${icon}']`,
      );
    };

    const page = new Page(client);
    const currentUrl = await page.url();
    const url = getExampleUrl(
      'media',
      'media-viewer',
      'mocked-viewer',
      // @ts-ignore
      global.__BASEURL__,
    );

    if (currentUrl !== url) {
      await page.goto(url);
    }

    await page.browser.maximizeWindow();

    await page.hover('img');
    await validateNameTypeAndIcon('media-test-file-2.jpg', 'image', 'image');

    await page.click("//span[@aria-label='Next']");

    await validateNameTypeAndIcon('media-test-file-3.png', 'image', 'image');

    await page.click("//span[@aria-label='Previous']");
    await page.click("//span[@aria-label='Previous']");

    await validateNameTypeAndIcon('media-test-file-1.png', 'image', 'image');
  },
);
