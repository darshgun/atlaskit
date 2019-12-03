import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMedia,
  fullpage,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'Inserts a media single with alt text',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
        UNSAFE_allowAltTextOnImages: true,
      },
    });

    // type some text
    await page.click(editable);
    await page.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(page);
    await page.isVisible('.media-single');

    await page.waitForSelector('.ProseMirror .media-single');

    await page.keys(['ArrowUp']);

    const altTextButtonSelector = '[aria-label="Alt text"]';
    await page.waitForSelector(altTextButtonSelector);
    await page.click(altTextButtonSelector);

    await page.waitForSelector('input');
    await page.type('input', 'lol');
    await page.keys(['Enter']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
