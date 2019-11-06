import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, fullpage } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
  copyAsHTML,
} from '../../__helpers/testing-example-helpers';
import { document } from './__fixtures__/document-with-table';

const editorSelector = '.ProseMirror';
const expandSelector = '[data-node-type="expand"]';
const nestedExpandSelector = '[data-node-type="nestedExpand"]';
const controlSelector = 'tbody tr:first-child th:nth-child(1)';

BrowserTestCase(
  'expand.ts: expand copied from renderer and pasted on full-page',
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<div id="RendererOutput"><div class="ak-renderer-document"><div data-node-type="expand" data-title="Expand title"><button aria-label="Expand Expand title"><p>Expand title</p></button><div><p>hello there</p></div></div></div></div></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      UNSAFE_allowExpand: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand with legal content pasted in table',
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<div data-node-type="expand" data-title="title" data-pm-slice="0 0 []"><p><span data-mention-id="here" data-access-level="CONTAINER" contenteditable="false" data-user-type="SPECIAL">@here</span> hello</p></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(document),
      UNSAFE_allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: expand with illegal content pasted in table',
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<div data-node-type="expand" data-title="title" data-pm-slice="0 0 []"><div data-panel-type="info"><div><p>content</p></div></div></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(document),
      UNSAFE_allowExpand: true,
      allowTables: {
        advanced: true,
      },
      allowPanel: true,
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: nestedExpand pasted in table',
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<div data-node-type="nestedExpand" data-title="title" data-pm-slice="0 0 []"><p>hello there</p></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(document),
      UNSAFE_allowExpand: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: nestedExpand pasted on top level',
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<div data-node-type="nestedExpand" data-title="title" data-pm-slice="0 0 []"><p>hello there</p></div>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      UNSAFE_allowExpand: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(expandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'expand.ts: table with nestedExpand pasted on top level',
  { skip: ['ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<table data-number-column="false" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="title" data-expanded="true"><p>content</p></div></td></tr></tbody></table>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      UNSAFE_allowExpand: true,
      allowTables: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector(nestedExpandSelector);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
