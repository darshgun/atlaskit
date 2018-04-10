import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editors, editable } from '../_helpers';

const more = '[aria-label="Open or close advance text formatting dropdown"]';
const underline = 'span=Underline';
const clear = 'span=Clear Formatting';

editors.forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select Clear Formatting on toolbar for ${
      editor.name
    } editor`,
    { skip: ['ie'] },
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(more);
      await browser.click(more);
      await browser.waitForSelector(underline);
      await browser.click(underline);
      await browser.type(editable, 'test');
      await browser.click(more);
      await browser.click(clear);
      await browser.type(editable, 'cleared');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
