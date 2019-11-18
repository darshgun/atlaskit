import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { EditorProps } from '../../types';
import {
  clipboardInput,
  copyAsPlaintextButton,
  copyAsHTMLButton,
} from '../integration/_helpers';

export async function mountEditor(page: Page, props: EditorProps) {
  await page.waitForSelector('#editor-container');
  await page.$eval(
    '#editor-container',
    (_e: any, props: EditorProps) => {
      (window as any).__mountEditor(props);
    },
    props,
  );
  await page.waitForSelector('.ProseMirror', { timeout: 500 });
  await page.click('.ProseMirror');
}

export async function goToEditorTestingExample(client: BrowserObject) {
  const page = new Page(client);
  const currentUrl = await page.url();
  const url = getExampleUrl(
    'editor',
    'editor-core',
    'testing',
    // @ts-ignore
    global.__BASEURL__,
  );

  if (currentUrl !== url) {
    await page.goto(url);
  }

  await page.maximizeWindow();

  return page;
}

export async function copyAsPlainText(page: Page, data: string) {
  await page.isVisible(clipboardInput);
  await page.clear(clipboardInput);
  await page.type(clipboardInput, data);
  await page.click(copyAsPlaintextButton);
}

export async function copyAsHTML(page: Page, data: string) {
  await page.isVisible(clipboardInput);
  await page.clear(clipboardInput);
  await page.type(clipboardInput, data);
  await page.click(copyAsHTMLButton);
}
