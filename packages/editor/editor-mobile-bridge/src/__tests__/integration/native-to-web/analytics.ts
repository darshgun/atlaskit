import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  callNativeBridge,
  clearBridgeOutput,
  editor,
  skipBrowsers as skip,
  getBridgeOutput,
} from '../_utils';

import { INPUT_METHOD, AnalyticsEventPayload } from '@atlaskit/editor-core';

const getBridgeTrackAnalyticsEvents = async (browser: any) => {
  const outputEvents = await getBridgeOutput(
    browser,
    'analyticsBridge',
    'trackEvent',
  );

  return outputEvents
    .map((outputEvent: any) => JSON.parse(outputEvent.event))
    .filter(
      (analyticsEvent: AnalyticsEventPayload) =>
        analyticsEvent.eventType == 'track',
    );
};

BrowserTestCase(
  'editor: toggling bold style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onBoldClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: toggling italic style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onItalicClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: toggling underline style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onUnderlineClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: toggling code style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onCodeClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: toggling strike style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onStrikeClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: toggling superscript style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onSuperClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: toggling subscript style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(browser, 'onSubClicked', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: updating status fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'onStatusUpdate',
      'test-text',
      'red',
      'test-uuid',
      INPUT_METHOD.TOOLBAR,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: setting block type to heading fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'onBlockSelected',
      'heading1',
      INPUT_METHOD.TOOLBAR,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting ordered list fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'onOrderedListSelected',
      INPUT_METHOD.TOOLBAR,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting bullet list fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: indenting list fires analytics events via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
    await clearBridgeOutput(browser);
    await callNativeBridge(browser, 'onOutdentList', INPUT_METHOD.TOOLBAR);
    await callNativeBridge(browser, 'onIndentList', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: outdenting list fires analytics events via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
    await clearBridgeOutput(browser);
    await callNativeBridge(browser, 'onOutdentList', INPUT_METHOD.TOOLBAR);

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting block quote fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'insertBlockType',
      'blockquote',
      INPUT_METHOD.INSERT_MENU,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting code block fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'insertBlockType',
      'codeblock',
      INPUT_METHOD.INSERT_MENU,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting panel fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'insertBlockType',
      'panel',
      INPUT_METHOD.INSERT_MENU,
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting action fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'insertBlockType',
      'action',
      INPUT_METHOD.INSERT_MENU,
      'test-action-list-id',
      'test-action-item-id',
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  'editor: inserting decision fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editor.placeholder);
    await callNativeBridge(
      browser,
      'insertBlockType',
      'decision',
      INPUT_METHOD.INSERT_MENU,
      'test-decision-list-id',
      'test-decision-item-id',
    );

    const trackEvents = await getBridgeTrackAnalyticsEvents(browser);

    expect(trackEvents).toMatchCustomSnapshot(testName);
  },
);
