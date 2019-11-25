// Current version of webdriverio have somewhat awkward state of type definitions.
// You can't import specific types, but you rather import a workspace and later use `BrowserObject`
// as a global type. This going to be fixed when we bump it's version as part of BUILDTOOLS-332
import 'webdriverio';

const assert = require('assert').strict;
/*
 * wrapper on top of webdriver-io apis to give a feel of puppeeteer api
 */

const WAIT_TIMEOUT = 5000;
const EDITOR = '.ProseMirror';

interface BBoxWithId {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

interface WaitingOptions {
  timeout: number;
}

const mappedKeys: { [key: string]: string } = {
  NULL: '\ue000',
  ArrowLeft: '\ue012',
  ArrowRight: '\ue014',
  ArrowUp: '\ue013',
  ArrowDown: '\ue015',
  Escape: '\ue00C',
  Return: '\ue007',
  Enter: '\ue007',
  Control: '\ue009',
  Shift: '\ue008',
  Insert: '\ue016',
  Command: '\ue03D',
};

const getMappedKey = (str: string) => {
  return mappedKeys[str] || str;
};
const defaultWaitingOptions: WaitingOptions = { timeout: WAIT_TIMEOUT };

type Done<T> = (result: T) => any;

export default class Page {
  private browser: BrowserObject;

  constructor(browserObject: BrowserObject) {
    this.browser = browserObject;
  }

  async type(selector: string, text: string | string[]) {
    // TODO: https://product-fabric.atlassian.net/browse/BUILDTOOLS-325
    if (this.isBrowser('chrome') && selector === EDITOR) {
      if (Array.isArray(text)) {
        return this.browser.sendKeys(text.map(getMappedKey));
      }
      return this.browser.sendKeys([getMappedKey(text)]);
    }

    const elem = await this.browser.$(selector);

    if (Array.isArray(text)) {
      for (const t of text) {
        await elem.addValue(t);
      }
    } else {
      await elem.addValue(text);
    }
  }

  goto(url: string) {
    return this.browser.url(url);
  }

  refresh() {
    return this.browser.refresh();
  }

  async moveTo(selector: string, x: number, y: number) {
    if (this.isBrowser('Safari')) {
      await this.getBoundingRect(selector);
      await this.SafariMoveTo([{ x, y }]);
    } else {
      const elem = await this.browser.$(selector);
      elem.moveTo(x, y);
      await this.browser.pause(500);
    }
  }

  // This function simulates user select multiple document node by drag and drop.
  async simulateUserSelection(startSelector: string, targetSelector: string) {
    const startBounds = await this.getBoundingRect(startSelector);
    const targetBounds = await this.getBoundingRect(targetSelector);

    // Note 1: Bound with 1 px so would not go over the elements.
    // Note 2: Assume the content layout is from left to right and top to bottom.
    const [startXOffset, startYOffset, targetXOffset, targetYOffset] =
      startBounds.top > targetBounds.top
        ? [startBounds.width - 1, startBounds.height - 1, 1, 1]
        : [1, 1, targetBounds.width - 1, targetBounds.height - 1];

    return this.simulateUserDragAndDrop(
      Math.floor(startBounds.left + startXOffset),
      Math.floor(startBounds.top + startYOffset),
      Math.floor(targetBounds.left + targetXOffset),
      Math.floor(targetBounds.top + targetYOffset),
    );
  }

  async simulateUserDragAndDrop(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    duration: number = 2000,
  ) {
    if (this.isBrowser('chrome')) {
      return this.simulateUserDragAndDropChrome(
        startX,
        startY,
        targetX,
        targetY,
      );
    }

    const moveToStart = {
      type: 'pointerMove',
      duration: 0,
      x: startX,
      y: startY,
    };
    const pointerDown = { type: 'pointerDown', button: 0 };
    const pause = { type: 'pause', duration: 100 };
    const moveToTarget = {
      type: 'pointerMove',
      duration,
      x: targetX,
      y: targetY,
    };
    const pointerUp = {
      type: 'pointerUp',
      button: 0,
    };

    return this.browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'mouse' },
        actions: [
          moveToStart,
          pause,
          pointerDown,
          pause,
          moveToTarget,
          pause,
          pointerUp,
          pause,
        ],
      },
    ]);
  }

  async simulateUserDragAndDropChrome(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
  ) {
    await this.moveTo('body', startX, startY);
    await this.browser.buttonDown();
    await this.moveTo('body', targetX, targetY);
    await this.browser.buttonUp();
    return this.browser.pause(500);
  }

  async hover(selector: string) {
    if (this.isBrowser('Safari')) {
      const bounds = await this.getBoundingRect(selector);
      await this.SafariMoveTo([{ x: bounds.left, y: bounds.top }]);
    } else {
      const elem = await this.browser.$(selector);
      await elem.moveTo(1, 1);
      return this.browser.pause(500);
    }
  }

  // TODO: Remove it after the fix been merged on webdriver.io:
  // https://github.com/webdriverio/webdriverio/pull/4330
  async SafariMoveTo(coords: { x: number; y: number }[]) {
    const actions = coords.map(set => ({
      type: 'pointerMove',
      duration: 0,
      x: set.x,
      y: set.y,
    }));

    return this.browser.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'mouse' },
        actions,
      },
    ]);
  }

  async getBoundingRect(selector: string): Promise<BBoxWithId> {
    const bbox = await this.execute((selector: string) => {
      const element = document.querySelector(selector);
      if (element) {
        // Result of next call is ClientRect | DOMRect, one contains left/right props, other x/y
        const rect = element.getBoundingClientRect();
        const { left, top, width, height } = rect;
        const { x, y } = rect as DOMRect;
        return {
          left: x || left,
          top: y || top,
          width,
          height,
          id: element.id,
        };
      }
    }, selector);
    if (!bbox) {
      throw new Error(`${selector} couldn't been found`);
    }
    return bbox;
  }

  async title() {
    return this.browser.getTitle();
  }

  async $(selector: string) {
    return this.browser.$(selector);
  }

  async $$(selector: string) {
    return this.browser.$$(selector);
  }

  async setValue(selector: string, text: string) {
    const elem = await this.$(selector);
    return elem.setValue(text);
  }

  async count(selector: string) {
    const result = await this.$$(selector);
    return result.length;
  }

  async clear(selector: string) {
    const elem = await this.$(selector);
    return elem.clearValue();
  }

  async click(selector: string) {
    try {
      const elem = await this.$(selector);
      return elem.click();
    } catch (e) {
      return e;
    }
  }

  async keys(values: string | string[], directCall: boolean = false) {
    if (directCall) {
      this.browser.keys(values);
    } else {
      const keys = Array.isArray(values) ? values : [values];
      for (let key of keys) {
        await this.browser.keys(key);
      }
    }
  }

  debug() {
    return this.browser.debug();
  }

  async getCSSProperty(selector: string, cssProperty: string) {
    const elem = await this.$(selector);
    return elem.getCSSProperty(cssProperty);
  }

  async getLocation(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.getLocation();
  }

  getAlertText() {
    return this.browser.getAlertText();
  }

  async getAttribute(selector: string, attributeName: string) {
    const elem = await this.browser.$(selector);
    return elem.getAttribute(attributeName);
  }

  url() {
    return this.browser.getUrl();
  }

  // Protocol
  goBack() {
    return this.browser.back();
  }

  acceptAlert() {
    return this.browser.acceptAlert();
  }

  close() {
    return this.browser.closeWindow();
  }

  async checkConsoleErrors() {
    // Console errors can only be checked in Chrome
    if (this.isBrowser('chrome')) {
      const logs = await this.browser.getLogs('browser');
      if (logs.length) {
        logs.forEach((log: any) => {
          assert.notStrictEqual(log.level, 'SEVERE', `Error : ${log.message}`);
        });
      }
    }
  }

  backspace(selector: string) {
    this.browser.execute(selector => {
      return document
        .querySelector(selector)
        .trigger({ type: 'keydown', which: 8 });
    });
  }

  // To be replaced by those puppeeter functions
  //  keyboard.down('KeyA');
  //  keyboard.press('KeyA');
  //  keyboard.up('Shift');

  //will need to have wrapper for these once moved to puppeteer
  async getText(selector: string) {
    // replace with await page.evaluate(() => document.querySelector('p').textContent)
    // for puppeteer
    const elem = await this.browser.$(selector);
    return elem.getText();
  }

  async getValue(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.getValue();
  }

  $eval<T, P>(
    selector: string,
    pageFunction: (element: HTMLElement | null, params?: P) => T,
    param?: P,
  ): Promise<T> {
    return this.browser.execute(
      `return (${pageFunction}(document.querySelector("${selector}"), ${JSON.stringify(
        param,
      )}))`,
    ) as Promise<T>;
  }

  async execute<T, P extends any[]>(
    script: string | ((...args: P) => T),
    ...args: P
  ): Promise<T> {
    return this.browser.execute(
      script as string | ((...args: any[]) => T),
      ...args,
    ) as Promise<T>;
  }

  async executeAsync<T>(func: (done: Done<T>) => void): Promise<T>;
  async executeAsync<A, T>(
    func: (arg1: A, done: Done<T>) => void,
    arg: A,
  ): Promise<T>;
  async executeAsync<A, B, T>(
    func: (arg1: A, arg2: B, done: Done<T>) => void,
    ...args: [A, B]
  ): Promise<T>;
  async executeAsync<A, B, C, T>(
    func: (arg1: A, arg2: B, arg3: C, done: Done<T>) => void,
    ...args: [A, B, C]
  ): Promise<T>;
  async executeAsync<A, B, C, T>(
    func:
      | ((done: Done<T>) => void)
      | ((arg1: A, done: Done<T>) => void)
      | ((arg1: A, arg2: B, done: Done<T>) => void)
      | ((arg1: A, arg2: B, arg3: C, done: Done<T>) => void),
    ...args: [] | [A] | [A, B] | [A, B, C]
  ): Promise<T> {
    return this.browser.executeAsync(func, ...args);
  }

  getBrowserName() {
    return this.browser.capabilities.browserName;
  }

  isBrowser(browserName: string) {
    return this.getBrowserName() === browserName;
  }

  async getElementSize(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.getSize();
  }

  async getHTML(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.getHTML(false);
  }

  async getProperty(selector: string, property: string) {
    const elem = await this.browser.$(selector);
    return elem.getProperty(property);
  }

  async isEnabled(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.isEnabled();
  }

  async isExisting(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.isExisting();
  }

  async isVisible(selector: string) {
    return this.waitFor(selector);
  }

  async isSelected(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.isSelected();
  }

  async hasFocus(selector: string) {
    const elem = await this.browser.$(selector);
    return elem.isFocused();
  }

  isWindowsPlatform() {
    const { platformName } = this.browser.capabilities;
    // In current version of webdriverio capabilities defined platformName,
    // but somehow in runtime it filled with os I am not where it is coming from.
    const { os } = this.browser.capabilities as any;
    return platformName === 'Windows' || os === 'Windows';
  }

  async paste() {
    let keys;
    if (this.isWindowsPlatform()) {
      keys = ['Control', 'v'];
    } else if (this.isBrowser('chrome')) {
      // Workaround for https://bugs.chromium.org/p/chromedriver/issues/detail?id=30
      keys = ['Shift', 'Insert'];
    } else {
      keys = ['Command', 'v'];
    }

    await this.browser.keys(keys);
    return this.browser.keys(keys[0]);
  }

  async copy() {
    let keys;
    if (this.isWindowsPlatform()) {
      keys = ['Control', 'c'];
    } else if (this.isBrowser('chrome')) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands
      return await this.execute('document.execCommand("copy")');
    } else {
      keys = ['Command', 'c'];
    }

    if (this.isWindowsPlatform() && this.isBrowser('chrome')) {
      // For Windows we need to send a keyup signal to release Control key
      // https://webdriver.io/docs/api/browser/keys.html
      await this.browser.keys(keys);
      return this.browser.keys('Control');
    }

    return this.browser.keys(keys);
  }

  // behaviour is OS specific:
  // windows moves to next paragraph up
  // osx moves to top of document
  moveUp(selector: string) {
    let control: string = 'Command';
    if (this.isWindowsPlatform()) {
      control = 'Control';
    }

    const keys = [control, 'ArrowUp'];
    if (this.isBrowser('chrome')) {
      return this.type(selector, keys);
    }

    return this.browser.keys(keys);
  }

  // Wait
  async waitForSelector(
    selector: string,
    options: WaitingOptions = defaultWaitingOptions,
    reverse = false,
  ) {
    const elem = await this.browser.$(selector);
    return elem.waitForExist(options.timeout, reverse);
  }

  async waitForVisible(
    selector: string,
    options: WaitingOptions = defaultWaitingOptions,
  ) {
    const elem = await this.$(selector);

    return elem.waitForDisplayed(options.timeout);
  }

  async waitUntilContainsText(selector: string, text: string) {
    await this.waitUntil(async () => {
      const content = await this.getText(selector);
      return content.indexOf(text) !== -1;
    });
  }

  waitFor(
    selector: string,
    ms: number | undefined = undefined,
    reverse: boolean = false,
  ) {
    const options = ms !== undefined ? { timeout: ms } : undefined;
    return this.waitForSelector(selector, options, reverse);
  }

  waitUntil(predicate: () => boolean | Promise<boolean> | Promise<unknown>) {
    // TODO This is not right. this.browser.waitUntil can't take `() => Promise<boolean>`
    return this.browser.waitUntil(predicate as any, WAIT_TIMEOUT);
  }

  // Window
  setWindowSize(width: number, height: number) {
    return this.browser.setWindowSize(width, height);
  }

  mockDate(timestamp: number, timezoneOffset: number) {
    this.browser.execute(
      (t, tz) => {
        const _Date = ((window as any)._Date = window.Date);
        const realDate = (params: any) => new _Date(params);
        let offset = 0;

        if (tz) {
          const localDateOffset = new _Date(t).getTimezoneOffset() / 60;
          offset = (tz + localDateOffset) * 3600000;
        }

        const mockedDate = new _Date(t + offset);

        (window as any).Date = function(params: any) {
          if (params) {
            return realDate(params);
          }
          return mockedDate;
        };
        Object.getOwnPropertyNames(_Date).forEach(property => {
          (window as any).Date[property] = (_Date as any)[property];
        });
        Date.now = () => t;
      },
      timestamp,
      timezoneOffset,
    );
    return () => {
      // Teardown function
      this.browser.execute(() => {
        window.Date = (window as any)._Date;
      });
    };
  }

  async safariCompatibleTab() {
    if (this.isBrowser('Safari')) {
      await this.keys('\ue00A\ue004');
    } else {
      await this.keys('\ue004');
    }
  }

  async pause(timeInMilliseconds: number = 1000) {
    await this.browser.pause(timeInMilliseconds);
  }

  async maximizeWindow() {
    await this.browser.maximizeWindow();
  }

  hasCapabilities() {
    return !!this.browser.capabilities;
  }
}
