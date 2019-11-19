import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';

const url = getExampleUrl(
  'media',
  'media-viewer',
  'mocked-viewer',
  // @ts-ignore
  global.__BASEURL__,
);
class MVExamplePage {
  constructor(private readonly page: typeof Page) {}

  async init() {
    const currentUrl = await this.page.url();

    if (currentUrl !== url) {
      await this.page.goto(url);
    }

    await this.page.browser.maximizeWindow();
  }

  async validateNameTypeAndIcon(name: string, type: string, icon: string) {
    await this.page.waitForSelector(`div=${name}`);
    await this.page.waitForSelector(
      `//div[text()='${name}']/../div/span[text()='${type}']`,
    );
    await this.page.waitForSelector(
      `//span[@aria-label='media-type']/ancestor::div[@type='${icon}']`,
    );
  }

  async navigateNext() {
    await this.forceNav();
    await this.page.click("//span[@aria-label='Next']");
  }

  async navigatePrevious() {
    await this.forceNav();
    await this.page.click("//span[@aria-label='Previous']");
  }

  async forceNav() {
    await this.page.hover('img');
  }

  async closeMV(closeWithEsc: boolean) {
    if (closeWithEsc) {
      await this.page.type('/*', 'Escape');
    } else {
      await this.forceNav();
      await this.page.click("//span[@aria-label='Close']");
    }
    await this.page.waitForSelector(
      "//div[@data-testid='media-viewer-image-content']",
      {},
      true,
    );
  }
}

const doNTimes = async (n: number, callback: () => Promise<any>) => {
  for (let i = 0; i < n; i++) {
    await callback();
  }
};

BrowserTestCase(
  'media-viewer-basic.ts: Navigation should navigate back and forth',
  { skip: [] },
  async (client: any, testName: string) => {
    const testPage = new MVExamplePage(new Page(client));
    await testPage.init();

    await testPage.validateNameTypeAndIcon(
      'media-test-file-2.jpg',
      'image',
      'image',
    );

    await testPage.navigateNext();
    await testPage.validateNameTypeAndIcon(
      'media-test-file-3.png',
      'image',
      'image',
    );

    await doNTimes(2, () => testPage.navigatePrevious());
    await testPage.validateNameTypeAndIcon(
      'media-test-file-1.png',
      'image',
      'image',
    );

    await doNTimes(3, () => testPage.navigateNext());
    await testPage.validateNameTypeAndIcon(
      'https://raw.githubusercontent.com/recurser/exif-orientation-examples/master/Landscape_0.jpg',
      'image',
      'image',
    );
  },
);

BrowserTestCase(
  'media-viewer-basic.ts: Should close on Close click',
  { skip: [] },
  async (client: any, testName: string) => {
    const testPage = new MVExamplePage(new Page(client));
    await testPage.init();

    await testPage.closeMV(false);
  },
);

BrowserTestCase(
  'media-viewer-basic.ts: Should close on Escape press',
  { skip: [] },
  async (client: any, testName: string) => {
    const testPage = new MVExamplePage(new Page(client));
    await testPage.init();

    await testPage.closeMV(true);
  },
);
