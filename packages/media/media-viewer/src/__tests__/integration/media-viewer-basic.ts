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
    await this.page.goto(url);
    await this.page.browser.maximizeWindow();
    await this.page.waitForVisible('[data-testid="media-viewer-popup"]');
    // here we use a backdoor to force-reveal controls forever
    await this.page.executeAsync((done: any) => {
      (window as any).forceShowControls();
      done();
    });
  }

  async validateNameSizeTypeAndIcon(
    name: string,
    size: string | null,
    type: string,
    icon: string,
  ) {
    await this.page.waitUntilContainsText(
      `[data-testid="media-viewer-file-name"]`,
      name,
    );
    await this.page.waitUntilContainsText(
      `div[data-testid="media-viewer-file-metadata-text"] span`,
      type,
    );
    if (size) {
      await this.page.waitUntilContainsText(
        `div[data-testid="media-viewer-file-metadata-text"]`,
        `${size}`,
      );
    }
    await this.page.waitForSelector(
      `[data-testid="media-viewer-file-type-icon"][type="${icon}"]`,
    );
  }

  async navigateNext() {
    await this.page.click('[data-testid="media-viewer-navigation-next"]');
    await this.page.waitForVisible(
      '[data-testid="media-viewer-image-content"]',
    );
  }

  async navigatePrevious() {
    await this.page.click('[data-testid="media-viewer-navigation-prev"]');
  }

  async closeMediaViewer(closeWithEsc: boolean) {
    if (closeWithEsc) {
      await this.page.sendKeys('/*', 'Escape');
    } else {
      await this.page.click('[data-testid="media-viewer-close-button"]');
    }

    await this.page.waitUntil(async () => {
      try {
        const exists = await this.page.isExisting(
          '[data-testid="media-viewer-popup"]',
        );
        return !exists;
      } catch (error) {
        // for some inexplicable reason if element doesn't exist IE11 throws instead of returning false
        // also, disregard it's called `ie` in the config, it's returned like this from browser capabilites object
        if (this.page.isBrowser('internet explorer')) {
          return true;
        } else {
          return false;
        }
      }
    });
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

    await testPage.validateNameSizeTypeAndIcon(
      'media-test-file-2.jpg',
      '16 KB',
      'image',
      'image',
    );

    await testPage.navigateNext();
    await testPage.validateNameSizeTypeAndIcon(
      'media-test-file-3.png',
      '88 KB',
      'image',
      'image',
    );

    await doNTimes(2, () => testPage.navigatePrevious());
    await testPage.validateNameSizeTypeAndIcon(
      'media-test-file-1.png',
      '158 B',
      'image',
      'image',
    );

    await doNTimes(3, () => testPage.navigateNext());
    await testPage.validateNameSizeTypeAndIcon(
      'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Atlassian-horizontal-blue-rgb.svg',
      null,
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

    await testPage.closeMediaViewer(false);
  },
);

BrowserTestCase(
  'media-viewer-basic.ts: Should close on Escape press',
  { skip: [] },
  async (client: any, testName: string) => {
    const testPage = new MVExamplePage(new Page(client));
    await testPage.init();

    await testPage.closeMediaViewer(true);
  },
);
