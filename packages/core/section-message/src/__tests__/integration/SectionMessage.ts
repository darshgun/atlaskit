import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

/* Url to test the example */
const urlSectionMessage = getExampleUrl('core', 'flag', 'testing');

/* Css selectors used for the test */
const addSectionMessageBtn = "[data-testid='AddSectionMessage']";
const flagTestId1 = "[data-testid='MySectionMessageTestId--1']";
const flagTestId2 = "[data-testid='MySectionMessageTestId--2']";
const flagActionTestId1 =
  "[data-testid='MySectionMessageTestId--1'] [data-testid='MySectionMessageAction']";
const flagActionTestId2 =
  "[data-testid='MySectionMessageTestId--2'] [data-testid='MySectionMessageAction']";
const dismisSectionMessage = "[aria-label='Dismiss flag']";

BrowserTestCase(
  'SectionMessage and SectionMessage actions should be able to be identified and clicked by data-testid',
  {} as any,
  async (client: any) => {
    const flagTest = new Page(client);
    await flagTest.goto(urlSectionMessage);
    await flagTest.waitFor(addSectionMessageBtn, 5000);
    await flagTest.click(addSectionMessageBtn);
    expect(await flagTest.isVisible(flagTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId1)).toBe(true);
    await flagTest.click(flagActionTestId1);
    const textAlert = await flagTest.getAlertText();
    expect(textAlert).toBe('SectionMessage has been clicked!');
    await flagTest.acceptAlert();
    await flagTest.click(addSectionMessageBtn);
    expect(await flagTest.isVisible(flagTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagTestId2)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId2)).toBe(true);
    await flagTest.click(dismisSectionMessage);
    expect(await flagTest.isVisible(flagTestId1)).toBe(true);
    expect(await flagTest.isVisible(flagActionTestId1)).toBe(true);
  },
);
