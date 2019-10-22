const assert = require('assert').strict;

/*
 * wrapper on top of webdriver-io apis to give a feel of puppeeteer api
 */

const WAIT_TIMEOUT = 5000;
const EDITOR = '.ProseMirror';

export class JSHandle {
  constructor(client, selector) {
    this.browser = client;
    this.selector = selector;
  }

  asElement() {
    return new ElementHandle(this.browser, this.selector);
  }

  dispose = TODO;
  executionContext = TODO;
  getProperties = TODO;
  jsonValue = TODO;
}

export class ElementHandle extends JSHandle {
  $ = TODO;
  $$ = TODO;
  $x = TODO;
  asElement = TODO;
  boundingBox = TODO;
  click = TODO;
  dispose = TODO;
  executionContext = TODO;
  focus = TODO;
  getProperties = TODO;
  hover = TODO;
  jsonValue = TODO;
  press = TODO;
  screenshot = TODO;
  tap = TODO;
  toString = TODO;
  type = TODO;
  uploadFile = TODO;
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
  constructor(client) {
    this.browser = client;
  }

  async type(selector, text) {
    // TODO: https://product-fabric.atlassian.net/browse/BUILDTOOLS-325
    if (this.isBrowser('chrome') && selector === EDITOR) {
      if (Array.isArray(text)) {
        return await this.browser.sendKeys(text.map(getMappedKey));
      } else {
        return await this.browser.sendKeys([getMappedKey(text)]);
      }
    }

    const elem = await this.browser.$(selector);

    if (Array.isArray(text)) {
      for (let t of text) {
        await elem.addValue(t);
      }
    } else {
      await elem.addValue(text);
    }
  }

  // Navigation
  goto(url) {
    return this.browser.url(url);
  }

  refresh() {
    return this.browser.refresh();
  }

  async moveTo(selector, x, y) {
    if (this.isBrowser('Safari')) {
      const bounds = await this.getBoundingRect(selector);
      await this.SAFARI_moveTo([{ x, y }]);
    } else {
      const elem = await this.browser.$(selector);
      elem.moveTo(x, y);
      await this.browser.pause(500);
    }
  }

  async hover(selector) {
    if (this.isBrowser('Safari')) {
      const bounds = await this.getBoundingRect(selector);

      await this.SAFARI_moveTo([{ x: bounds.left, y: bounds.top }]);
    } else {
      const elem = await this.browser.$(selector);
      await elem.moveTo(1, 1);
      return await this.browser.pause(500);
    }
  }

  // TODO: Remove it after the fix been merged on webdriver.io:
  // https://github.com/webdriverio/webdriverio/pull/4330
  async SAFARI_moveTo(coords) {
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

  async getBoundingRect(selector) {
    return await this.browser.execute(selector => {
      const element = document.querySelector(selector);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);
  }

  async title() {
    return await this.browser.getTitle();
  }

  async $(selector) {
    const ele = await this.browser.$(selector);

    return ele;
  }

  async $$(selector) {
    const ele = await this.browser.$$(selector);
    return ele;
  }

  $eval(selector, pageFunction, param) {
    return this.browser.execute(
      `return (${pageFunction}(document.querySelector("${selector}"), ${JSON.stringify(
        param,
      )}))`,
    );
  }

  async setValue(selector, text) {
    const elem = await this.browser.$(selector);
    return elem.setValue(text);
  }

  async count(selector) {
    const result = await this.$$(selector);
    return result.length;
  }

  async clear(selector) {
    const elem = await this.browser.$(selector);
    return elem.clearValue();
  }

  async click(selector) {
    try {
      const elem = await this.browser.$(selector);
      return elem.click();
    } catch (e) {
      return e;
    }
  }

  async keys(values) {
    const keys = Array.isArray(values) ? values : [values];

    for (let key of keys) {
      await this.browser.keys(key);
    }
  }

  debug() {
    return this.browser.debug();
  }

  // Get
  getProperty(selector, cssProperty) {
    return this.browser.getCssProperty(selector, cssProperty);
  }

  async getCSSProperty(selector, cssProperty) {
    const elem = await this.browser.$(selector);
    return elem.getCSSProperty(cssProperty);
  }

  async getLocation(selector, property) {
    const elem = await this.browser.$(selector);
    return elem.getLocation(selector, property);
  }

  getAlertText() {
    return this.browser.getAlertText();
  }

  async getAttribute(selector, attributeName) {
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

  backspace(selector) {
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
  async getText(selector) {
    // replace with await page.evaluate(() => document.querySelector('p').textContent)
    // for puppeteer
    const elem = await this.browser.$(selector);
    return elem.getText();
  }

  async getValue(selector) {
    const elem = await this.browser.$(selector);
    return elem.getValue();
  }

  async execute(func, ...args) {
    return this.browser.execute(func, ...args);
  }

  async executeAsync(func, ...args) {
    return this.browser.executeAsync(func, ...args);
  }

  getBrowserName() {
    return this.browser.capabilities.browserName;
  }

  isBrowser(browserName) {
    return this.getBrowserName() === browserName;
  }

  async getCssProperty(selector, cssProperty) {
    const elem = this.browser.$(selector);
    return elem.getCssProperty(selector, cssProperty);
  }

  async getElementSize(selector) {
    const elem = this.browser.$(selector);
    return elem.getSize(selector);
  }

  async getHTML(selector) {
    const elem = await this.browser.$(selector);
    return elem.getHTML(false);
  }

  async getProperty(selector, property) {
    const elem = await this.browser.$(selector);
    return elem.getProperty(property);
  }

  async isEnabled(selector) {
    const elem = await this.browser.$(selector);
    return elem.isEnabled();
  }

  async isExisting(selector) {
    const elem = await this.browser.$(selector);
    return elem.isExisting();
  }

  async isVisible(selector) {
    return this.waitFor(selector);
  }

  async isSelected(selector) {
    const elem = await this.browser.$(selector);
    return elem.isSelected();
  }

  async hasFocus(selector) {
    const elem = await this.browser.$(selector);
    return elem.isFocused();
  }

  log(type) {
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

  async copy(selector) {
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
  moveUp(selector) {
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
  async waitForSelector(selector, options = {}, reverse = false) {
    const elem = await this.browser.$(selector);
    return elem.waitForExist(options.timeout || WAIT_TIMEOUT, reverse);
  }

  async waitForVisible(selector, options = {}) {
    const elem = await this.browser.$(selector);

    return elem.waitForDisplayed(options.timeout || WAIT_TIMEOUT);
  }

  async waitUntilContainsText(selector, text) {
    await this.waitUntil(async () => {
      const content = await this.getText(selector);
      return content.indexOf(text) !== -1;
    });
  }

  waitFor(selector, ms, reverse) {
    return this.waitForSelector(selector, { timeout: ms }, reverse);
  }

  waitUntil(predicate) {
    return this.browser.waitUntil(predicate, WAIT_TIMEOUT);
  }

  // Window
  setWindowSize(width, height) {
    return this.browser.setWindowSize(width, height);
  }

  chooseFile(selector, localPath) {
    return this.browser.chooseFile(selector, localPath);
  }

  mockDate(timestamp, timezoneOffset) {
    this.browser.execute(
      (t, tz) => {
        const _Date = (window._Date = window.Date);
        const realDate = params => new _Date(params);
        let offset = 0;

        if (tz) {
          localDateOffset = new _Date(t).getTimezoneOffset() / 60;
          offset = (tz + localDateOffset) * 3600000;
        }

        const mockedDate = new _Date(t + offset);

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
