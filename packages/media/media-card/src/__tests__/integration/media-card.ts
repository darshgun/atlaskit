import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { gotoCardFilesMockedPage } from '../_pages/card-files-mocked-page';

const cardStandardSelector = '[data-test-id="media-card-standard"]';
const cardWithContextIdSelector = '[data-test-id="media-card-with-context-id"]';

BrowserTestCase('MediaCard - load image', {}, async client => {
  const page = await gotoCardFilesMockedPage(client);

  const result = await page.isCardLoadedSuccessful(cardStandardSelector);
  expect(result).toBe(true);
});

BrowserTestCase('MediaCard - load image with contextId', {}, async client => {
  const page = await gotoCardFilesMockedPage(client);

  const result = await page.isCardLoadedSuccessful(cardWithContextIdSelector);
  expect(result).toBe(true);
});
