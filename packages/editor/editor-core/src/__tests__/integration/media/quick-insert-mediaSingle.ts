import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMediaFromMediaPicker,
  quickInsert,
  fullpage,
} from '../_helpers';
import constant from 'lodash.constant';
import times from 'lodash.times';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import { selectors } from '../panel/_utils';

BrowserTestCase(
  'quick-insert-mediaSingle.ts: Inserts a media single before paragraph',
  { skip: ['edge', 'ie', 'safari', 'chrome'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    });

    await page.click(editable);
    await page.type(editable, 'some text');
    await page.keys([...times(9, constant('ArrowLeft'))]);

    await quickInsert(page, 'Files & images');
    await insertMediaFromMediaPicker(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'quick-insert-mediaSingle.ts: Inserts a media single after paragraph',
  { skip: ['edge', 'ie', 'safari', 'chrome'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    });

    await page.click(editable);
    await page.type(editable, 'some text ');

    await quickInsert(page, 'Files & images');
    await insertMediaFromMediaPicker(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'quick-insert-mediaSingle.ts: Inserts a media single before paragraph nested in a panel',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
      allowPanel: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);
    await page.type(editable, 'some text');
    await page.keys([...times(9, constant('ArrowLeft'))]);

    await quickInsert(page, 'Files & images');
    await insertMediaFromMediaPicker(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'quick-insert-mediaSingle.ts: Inserts a media single after paragraph nested in a panel',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
      allowPanel: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);
    await page.type(editable, 'some text ');

    await quickInsert(page, 'Files & images');
    await insertMediaFromMediaPicker(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
