import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, getDocFromElement, fullpage } from '../_helpers';
import emptyExpandAdf from './__fixtures__/empty-expand.json';
import twoLineExpandAdf from './__fixtures__/two-line-expand.json';
import doubleExpand from './__fixtures__/double-expand.json';

import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

import { expandClassNames } from '../../../plugins/expand/ui/class-names';

const expandContentSelector = `.${expandClassNames.content} p`;

const focusExpandTitle = async (page: any) => {
  await page.browser.execute((selector: string) => {
    const input = document.querySelector('.' + selector);
    if (input) {
      // @ts-ignore
      input.focus();
    }
  }, expandClassNames.titleInput);
};

const collapseExpandThenFocusTitle = async (page: any) => {
  await page.click(`.${expandClassNames.icon}`);
  await focusExpandTitle(page);
};

BrowserTestCase(
  'navigation.ts: pressing Backspace should delete an expand when cursor is inside content',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await page.click(expandContentSelector);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing Backspace should delete an expand when cursor is inside title',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing Enter should collapse an expand when cursor is inside title',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowDown should set cursor after collapsed expand when it is in a title',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);
    await page.keys('ArrowDown');
    await page.type(editable, 'abc');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowDown should set cursor from expand title to the content',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await focusExpandTitle(page);
    await page.keys('ArrowDown');
    await page.type(editable, 'abc');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowRight from an expand title should set the right GapCursor',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await focusExpandTitle(page);
    await page.keys('ArrowRight');
    await page.type(editable, 'after');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowLeft from an expand title should set the left GapCursor',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await focusExpandTitle(page);
    await page.keys('ArrowLeft');
    await page.type(editable, 'before');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowUp from an expand title should set the left GapCursor',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await focusExpandTitle(page);
    await page.keys('ArrowUp');
    await page.type(editable, 'before');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowUp from an expand content should focus the title',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await page.click(expandContentSelector);
    await page.type(editable, 'content');
    await page.keys('ArrowUp');
    await page.type(editable, 'title');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowUp from a second line of an expand content should not focus the title',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: twoLineExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await page.click(expandContentSelector);
    await page.keys('ArrowDown');
    await page.keys('ArrowUp');
    await page.type(editable, 'test');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowDown from the left GapCursor position should focus the title when an expand is collapsed',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);
    await page.keys('ArrowLeft');
    await page.keys('ArrowDown');
    await page.type(editable, 'title');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'navigation.ts: pressing ArrowUp from the right GapCursor position should focus the title when an expand is collapsed',
  { skip: ['ie', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: emptyExpandAdf,
      UNSAFE_allowExpand: true,
    });

    await collapseExpandThenFocusTitle(page);
    await page.keys('ArrowRight');
    await page.keys('ArrowUp');
    await page.type(editable, 'title');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

describe('when there is a expanded followed by another', () => {
  describe('when both are collapsed', () => {
    describe('and the focus are inside of the first title', () => {
      BrowserTestCase(
        'pressing ArrowDown should create a gap cursor on the left',
        { skip: ['ie'] },
        async (client: any, testName: string) => {
          const page = await goToEditorTestingExample(client);

          await mountEditor(page, {
            appearance: fullpage.appearance,
            defaultValue: doubleExpand,
            UNSAFE_allowExpand: true,
          });

          await page.click(
            '.ak-editor-expand__title-input[value="First title"]',
          );
          await page.keys('ArrowDown');
          await page.keys('I am here'.split(''));

          const doc = await page.$eval(editable, getDocFromElement);
          expect(doc).toMatchCustomDocSnapshot(testName);
        },
      );
    });
  });
});
