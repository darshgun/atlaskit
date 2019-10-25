import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  fullpage,
  copyToClipboard,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { sleep } from '@atlaskit/media-test-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'upload-external-media.ts: Uplaods external media when pasted',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testCase: string) => {
    const sample = new Page(client);
    await copyToClipboard(
      sample,
      `<meta charset='utf-8'><img src="https://images2.minutemediacdn.com/image/upload/c_crop,h_1193,w_2121,x_0,y_64/f_auto,q_auto,w_1100/v1565279671/shape/mentalfloss/578211-gettyimages-542930526.jpg" alt="Image result for cats"/>`,
      'html',
    );

    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
      },
    });
    await page.paste(editable);
    await sleep(0);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testCase);
  },
);
