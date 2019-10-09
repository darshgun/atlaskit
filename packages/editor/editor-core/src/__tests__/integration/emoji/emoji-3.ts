import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import {
  getDocFromElement,
  editable,
  insertEmoji,
  emojiItem,
  typeahead,
  highlightEmojiInTypeahead,
} from '../_helpers';

// safari failure on browserstack
BrowserTestCase(
  'emoji-3.ts: user can navigate typeahead using keyboard',
  { skip: ['safari', 'ie', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, ':');
    await page.type(editable, 'smi');
    await page.waitForSelector(typeahead);
    await page.keys('ArrowDown');

    // The typeahead may re-order our results.
    // Go down 5 items til we find our desired emoji
    await highlightEmojiInTypeahead(page, 'smile');

    await page.keys('Return');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// issue with safari on browserstack works on local
BrowserTestCase(
  'emoji-3.ts: should select emoji on return',
  { skip: ['safari', 'ie', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, ':');
    await page.type(editable, 'wink');
    await page.waitForSelector(typeahead);

    // The typeahead may re-order our results.
    // Grab the currently selected emoji, to reference in render.
    await highlightEmojiInTypeahead(page, 'wink');

    await page.keys('Return');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-3.ts: should render emoji inside codeblock',
  { skip: ['safari', 'ie', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page', allowCodeBlocks: true });
    await page.type(editable, '```');
    await page.waitForSelector('pre', 1000);
    await page.type(editable, ':smile:');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// BUG on IE
BrowserTestCase(
  'emoji-3.ts: should render emoji inside action',
  { skip: ['safari', 'ie', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, '[] ');
    await insertEmoji(page, 'smile');
    await page.waitForSelector(emojiItem('smile'), 1000);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-3.ts: should not show typeahead with text: ',
  { skip: ['ie'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'text: ');
    expect(await page.isExisting(typeahead)).toBe(false);
  },
);

BrowserTestCase(
  'emoji-3.ts: ":<space>" does not show the picker',
  { skip: ['ie'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, ': ');
    expect(await page.isExisting(typeahead)).toBe(false);
  },
);

BrowserTestCase(
  'emoji-3.ts: emoji picker search should be focused by default',
  { skip: ['safari'] },
  async (client: any) => {
    const emojiButton = 'button span[aria-label="Emoji"]';
    const emojiSearch = '[data-emoji-picker-container] input';

    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });

    await page.waitFor(emojiButton);

    // Equivalent with page.click(emojiButton) which
    // which did not work for SafariDriver in this case
    await client.execute((emojiButton: string) => {
      const el = document.querySelector(emojiButton) as HTMLElement;
      el.click();
    }, emojiButton);

    await page.waitFor(emojiSearch);
    expect(await page.hasFocus(emojiSearch)).toBe(true);
  },
);

BrowserTestCase(
  'emoji-3.ts: emoji picker should be scrollable',
  { skip: ['chrome', 'ie', 'firefox'] }, // { only: ['safari'] }
  async (client: any) => {
    const emojiButton = 'button span[aria-label="Emoji"]';
    const emojiList = '[data-emoji-picker-container] .ReactVirtualized__List';

    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });

    await page.waitFor(emojiButton);

    // Equivalent with page.click(emojiButton) which
    // which did not work for SafariDriver in this case
    await client.execute((emojiButton: string) => {
      const el = document.querySelector(emojiButton) as HTMLElement;
      el.click();
    }, emojiButton);

    await page.waitFor(emojiList);

    await client.execute((emojiList: string) => {
      const el = document.querySelector(emojiList) as HTMLElement;
      el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
    }, emojiList);

    await page.tick();

    const scrollTop = await client.execute((emojiList: string) => {
      const el = document.querySelector(emojiList) as HTMLElement;
      return el.scrollTop;
    }, emojiList);

    expect(scrollTop).toBe(100);
  },
);
