/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
// @flow
const assert = require('assert');

/*
 * wrapper on top of webdriver-io apis to give a feel of puppeeteer api
 */

const WAIT_TIMEOUT = 5000;
const EDITOR = '.ProseMirror';

export class JSHandle {
  browser /*: any */;

  selector /*: string */;

  constructor(client /*: any */, selector /*: string */) {
    this.browser = client;
    this.selector = selector;
  }

  asElement() {
    return new ElementHandle(this.browser, this.selector);
  }
  // TODO: Implement those methods
  // dispose = TODO;

  // executionContext = TODO;

  // getProperties = TODO;

  // jsonValue = TODO;
}

export class ElementHandle extends JSHandle {
  // TODO: Implement those methods
  // $ = TODO;
  // $$ = TODO;
  // $x = TODO;
  // asElement = TODO;
  // boundingBox = TODO;
  // click = TODO;
  // dispose = TODO;
  // executionContext = TODO;
  // focus = TODO;
  // getProperties = TODO;
  // hover = TODO;
  // jsonValue = TODO;
  // press = TODO;
  // screenshot = TODO;
  // tap = TODO;
  // toString = TODO;
  // type = TODO;
  // uploadFile = TODO;
}

const mappedKeys = {
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

const getMappedKey = str => {
  return mappedKeys[str] || str;
};

export default class Page {
  browser /*: any */;

  selector /*: string */;

  constructor(client /*:any */) {
    this.browser = client;
  }

  // eslint-disable-next-line consistent-return
  async type(selector /*: string */, text /*: string[] | string */) {
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

  // Navigation
  goto(url /*: string */) {
    return this.browser.url(url);
  }

  refresh() {
    return this.browser.refresh();
  }

  async moveTo(selector /*: string */, x /*: number */, y /*: number */) {
    if (this.isBrowser('Safari')) {
      // eslint-disable-next-line no-unused-vars
      const bounds = await this.getBoundingRect(selector);
      await this.SafariMoveTo([{ x, y }]);
    } else {
      const elem = await this.browser.$(selector);
      elem.moveTo(x, y);
      await this.browser.pause(500);
    }
  }

  // This function simulates user select multiple document node by drag and drop.
  async simulateUserSelection(
    startSelector /*: string */,
    targetSelector /*: string */,
  ) {
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
    startX /*: number */,
    startY /*: number */,
    targetX /*: number */,
    targetY /*: number */,
    duration /*: number */ = 2000,
  ) {
    if (this.isBrowser('chrome')) {
      return this.simulateUserDragAndDropChrome(
        startX,
        startY,
        targetX,
        targetY,
        duration,
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
    startX /*: number */,
    startY /*: number */,
    targetX /*: number */,
    targetY /*: number */,
    duration /*: number */ = 1000,
  ) {
    const elem = await this.browser.$('body');
    await elem.moveTo(startX, startY, duration);
    await this.browser.buttonDown();
    await elem.moveTo(targetX, targetY, duration);
    await this.browser.buttonUp();
    return this.browser.pause(500);
  }

  async hover(selector /*: string */) {
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
  async SafariMoveTo(coords /*: Array<Object> */) {
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

  async getBoundingRect(selector /*: string */) {
    // eslint-disable-next-line no-shadow
    return this.browser.execute(selector => {
      const element = document.querySelector(selector);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);
  }

  async title() {
    return this.browser.getTitle();
  }

  async $(selector /*: string */) {
    const ele = await this.browser.$(selector);

    return ele;
  }

  async $$(selector /*: string */) {
    const ele = await this.browser.$$(selector);
    return ele;
  }

  $eval(selector /*: string */, pageFunction /*: any */, param /*: Object*/) {
    return this.browser.execute(
      `return (${pageFunction}(document.querySelector("${selector}"), ${JSON.stringify(
        param,
      )}))`,
    );
  }

  async setValue(selector /*: string */, text /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.setValue(text);
  }

  async count(selector /*: string */) {
    const result = await this.$$(selector);
    return result.length;
  }

  async clear(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.clearValue();
  }

  async click(selector /*: string */) {
    try {
      const elem = await this.browser.$(selector);
      return elem.click();
    } catch (e) {
      return e;
    }
  }

  async keys(values /*: string[] | string */) {
    const keys = Array.isArray(values) ? values : [values];

    for (const key of keys) {
      await this.browser.keys(key);
    }
  }

  debug() {
    return this.browser.debug();
  }

  // Get
  getProperty(selector /*: string */, cssProperty) {
    return this.browser.getCssProperty(selector, cssProperty);
  }

  async getCSSProperty(selector /*: string */, cssProperty /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.getCSSProperty(cssProperty);
  }

  async getLocation(selector /*: string */, property /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.getLocation(selector, property);
  }

  getAlertText() {
    return this.browser.getAlertText();
  }

  async getAttribute(selector /*: string */, attributeName /*: string */) {
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
    return this.browser.close();
  }

  async checkConsoleErrors() {
    // Console errors can only be checked in Chrome
    if (this.isBrowser('chrome')) {
      const logs = await this.browser.getLogs('browser');
      if (logs.length) {
        logs.forEach(log => {
          assert.notStrictEqual(log.level, 'SEVERE', `Error : ${log.message}`);
        });
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  backspace(selector /*: string */) {
    // eslint-disable-next-line no-shadow
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
  async getText(selector /*: string */) {
    // replace with await page.evaluate(() => document.querySelector('p').textContent)
    // for puppeteer
    const elem = await this.browser.$(selector);
    return elem.getText();
  }

  async getValue(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.getValue();
  }

  async execute(func /*: Function */, ...args /*: any[] */) {
    return this.browser.execute(func, ...args);
  }

  async executeAsync(func /*: Function */, ...args /*: any[] */) {
    return this.browser.executeAsync(func, ...args);
  }

  getBrowserName() {
    return this.browser.capabilities.browserName;
  }

  isBrowser(browserName /*: string */) {
    return this.getBrowserName() === browserName;
  }

  async getCssProperty(selector /*: string */, cssProperty /*: string */) {
    const elem = this.browser.$(selector);
    return elem.getCssProperty(selector, cssProperty);
  }

  async getElementSize(selector /*: string */) {
    const elem = this.browser.$(selector);
    return elem.getSize(selector);
  }

  async getHTML(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.getHTML(false);
  }

  // eslint-disable-next-line no-dupe-class-members
  async getProperty(selector /*: string */, property /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.getProperty(property);
  }

  async isEnabled(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.isEnabled();
  }

  async isExisting(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.isExisting();
  }

  async isVisible(selector /*: string */) {
    return this.waitFor(selector);
  }

  async isSelected(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.isSelected();
  }

  async hasFocus(selector /*: string */) {
    const elem = await this.browser.$(selector);
    return elem.isFocused();
  }

  log(type /*: string */) {
    return this.browser.log(type);
  }

  async paste() {
    let keys;
    if (this.browser.capabilities.os === 'Windows') {
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
    if (this.browser.capabilities.os === 'Windows') {
      keys = ['Control', 'c'];
    } else if (this.isBrowser('chrome')) {
      // Workaround for https://bugs.chromium.org/p/chromedriver/issues/detail?id=30
      keys = ['Control', 'Insert'];
    } else {
      keys = ['Command', 'c'];
    }

    if (
      this.browser.capabilities.os === 'Windows' &&
      this.isBrowser('chrome')
    ) {
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
  moveUp(selector /*: string */) {
    let control = 'Command';
    if (this.browser.capabilities.os === 'Windows') {
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
    selector /*: string */,
    options /*: Object */ = {},
    reverse /*: boolean */ = false,
  ) {
    const elem = await this.browser.$(selector);
    return elem.waitForExist(options.timeout || WAIT_TIMEOUT, reverse);
  }

  async waitForVisible(selector /*: string */, options /*: Object */ = {}) {
    const elem = await this.browser.$(selector);

    return elem.waitForDisplayed(options.timeout || WAIT_TIMEOUT);
  }

  async waitUntilContainsText(selector /*: string */, text /*: string */) {
    await this.waitUntil(async () => {
      const content = await this.getText(selector);
      return content.indexOf(text) !== -1;
    });
  }

  waitFor(selector /*: string */, ms? /*: number */, reverse? /*: boolean */) {
    return this.waitForSelector(selector, { timeout: ms }, reverse);
  }

  waitUntil(predicate /*: any */) {
    return this.browser.waitUntil(predicate, WAIT_TIMEOUT);
  }

  // Window
  setWindowSize(width /*: string */, height /*: string */) {
    return this.browser.setWindowSize(width, height);
  }

  chooseFile(selector /*: string */, localPath /*: string */) {
    return this.browser.chooseFile(selector, localPath);
  }

  mockDate(timestamp /*: string */, timezoneOffset /*: string */) {
    this.browser.execute(
      (t, tz) => {
        // eslint-disable-next-line no-multi-assign
        const _Date = (window._Date = window.Date);
        const realDate = params => new _Date(params);
        let offset = 0;

        if (tz) {
          const localDateOffset = new _Date(t).getTimezoneOffset() / 60;
          offset = (tz + localDateOffset) * 3600000;
        }

        const mockedDate = new _Date(t + offset);

        // eslint-disable-next-line no-global-assign
        Date = function(...params) {
          if (params.length > 0) {
            return realDate(...params);
          }
          return mockedDate;
        };
        Object.getOwnPropertyNames(_Date).forEach(property => {
          Date[property] = _Date[property];
        });
        Date.now = () => t;
      },
      timestamp,
      timezoneOffset,
    );
    return () => {
      // Teardown function
      this.browser.execute(() => {
        window.Date = window._Date;
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
}
