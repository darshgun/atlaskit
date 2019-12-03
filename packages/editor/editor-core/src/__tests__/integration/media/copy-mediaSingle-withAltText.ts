import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import { testMediaFileId } from '@atlaskit/editor-test-helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';

const baseADFWithMediaAltText = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        width: 66.67,
        layout: 'wrap-left',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: testMediaFileId,
            type: 'file',
            collection: 'MediaServicesSample',
            width: 2378,
            height: 628,
            alt: 'test',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

BrowserTestCase(
  'Copy paste a media single with alt text properly',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(baseADFWithMediaAltText),
      media: {
        allowMediaSingle: true,
        UNSAFE_allowAltTextOnImages: true,
      },
    });

    await page.isVisible('.media-single');
    await page.waitForSelector('.ProseMirror :nth-child(1) .media-single');
    await page.click('.ProseMirror :nth-child(1) .media-single');
    await page.copy(editable);

    await page.keys(['ArrowDown']);

    await page.type(editable, 'pasting');

    await page.paste(editable);

    await page.waitForSelector('.ProseMirror :nth-child(3) .media-single');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
