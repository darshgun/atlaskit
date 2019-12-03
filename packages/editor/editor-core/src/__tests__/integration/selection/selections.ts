import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';

import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import blockExtensionAdf from './__fixtures__/block-extension-selection.adf.json';
import bodiedExtensionAdf from './__fixtures__/bodied-extension-selection.adf.json';
import smartLinkAdf from './__fixtures__/smart-link-selection.adf.json';
import blockCardAdf from './__fixtures__/block-card-selection.adf.json';
import mediaAdf from './__fixtures__/media-selection.adf.json';
import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers';

const testDocuments: { [key: string]: string } = {
  blockExtension: blockExtensionAdf,
  bodiedExtension: bodiedExtensionAdf,
  smartLink: smartLinkAdf,
  blockCard: blockCardAdf,
  mediaSingle: mediaAdf,
};

[
  [
    'h1:first-of-type',
    'h6:first-of-type',
    'blockCard',
    'top to bottom',
    '.blockCardView-content-wrap',
  ],
  [
    'h6:first-of-type',
    'h1:first-of-type',
    'blockCard',
    'bottom to top',
    '.blockCardView-content-wrap',
  ],
  ['h1:first-of-type', 'h6:first-of-type', 'mediaSingle', 'top to bottom'],
  ['h6:first-of-type', 'h1:first-of-type', 'mediaSingle', 'bottom to top'],
  // TODO fix the dummy content provider that breaks this test.
  // ['p:first-child', 'p:last-child', 'blockExtension', 'top to bottom'],
  [
    'h6:first-of-type',
    'h1:first-of-type',
    'blockExtension',
    'bottom to top',
    '.extensionView-content-wrap',
  ],
  [
    'h1:first-of-type',
    'h6:first-of-type',
    'bodiedExtension',
    'top to bottom',
    '.bodiedExtensionView-content-wrap',
  ],
  [
    'h6:first-of-type',
    'h1:first-of-type',
    'bodiedExtension',
    'bottom to top',
    '.bodiedExtensionView-content-wrap',
  ],
  [
    'h1:first-of-type',
    'h6:first-of-type',
    'smartLink',
    'top to bottom',
    '.inlineCardView-content-wrap',
  ],
  [
    'h6:first-of-type',
    'h1:first-of-type',
    'smartLink',
    'bottom to top',
    '.inlineCardView-content-wrap',
  ],
].forEach(([startSelector, targetSelector, name, direction, initSelection]) => {
  BrowserTestCase(
    `select-extension.ts: Select ${name} with other contents from ${direction}`,
    { skip: ['edge', 'ie', 'safari'] },
    async (client: any, testName: string) => {
      const page = await goToEditorTestingExample(client);
      const cardProvider = new EditorTestCardProvider();
      await mountEditor(page, {
        appearance: fullpage.appearance,
        allowExtension: true,
        media: {
          allowMediaSingle: true,
        },
        UNSAFE_cards: { provider: Promise.resolve(cardProvider) },
        defaultValue: testDocuments[name],
      });

      if (initSelection) {
        await page.waitForSelector(initSelection);
      }

      await page.pause(1000);

      await page.simulateUserSelection(startSelector, targetSelector);

      await page.pause(500);

      await page.keys('Backspace');

      await page.pause(500);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
