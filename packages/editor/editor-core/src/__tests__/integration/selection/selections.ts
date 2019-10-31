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
    'p:first-child',
    'p:last-child',
    'blockCard',
    'top to bottom',
    '.blockCardView-content-wrap',
  ],
  [
    'p:last-child',
    'p:first-child',
    'blockCard',
    'bottom to top',
    '.blockCardView-content-wrap',
  ],
  ['p:first-child', 'p:last-child', 'mediaSingle', 'top to bottom'],
  ['p:last-child', 'p:first-child', 'mediaSingle', 'bottom to top'],
  ['p:first-child', 'p:last-child', 'blockExtension', 'top to bottom'],
  ['p:last-child', 'p:first-child', 'blockExtension', 'bottom to top'],
  [
    'p:first-child',
    '.bodiedExtensionView-content-wrap + p',
    'bodiedExtension',
    'top to bottom',
  ],
  [
    '.bodiedExtensionView-content-wrap + p',
    'p:first-child',
    'bodiedExtension',
    'bottom to top',
  ],
  [
    'p:first-child',
    'p:last-child',
    'smartLink',
    'top to bottom',
    '.inlineCardView-content-wrap',
  ],
  [
    'p:last-child',
    'p:first-child',
    'smartLink',
    'bottom to top',
    '.inlineCardView-content-wrap',
  ],
].forEach(([startSelector, targetSelector, name, direction, initSelection]) => {
  BrowserTestCase(
    `select-extension.ts: Select ${name} with other contents from ${direction}`,
    { skip: ['edge', 'ie', 'safari', 'firefox'] },
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
        await page.browser.pause(1000);
      }

      await page.simulateUserSelection(startSelector, targetSelector);

      await page.browser.pause(500);

      await page.keys('Backspace');

      await page.browser.pause(500);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchCustomDocSnapshot(testName);
    },
  );
});
