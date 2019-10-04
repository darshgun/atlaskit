import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import cases from 'jest-in-case';
import InlineMessage from '../../..';

const MessageContent = (
  <div>
    <h4>It is so great to use data-testid</h4>
    <span>
      Visit{' '}
      <a href="https://atlaskit.atlassian.com/docs/guides/testing">here</a> to
      see more information
    </span>
  </div>
);

const createWrapper = (testId?) => (
  <InlineMessage
    type="error"
    title="My testing Inline Message"
    secondaryText="Use data-testid to reliable testing"
    testId={testId ? testId : null}
  >
    {MessageContent}
  </InlineMessage>
);

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(createWrapper());
    expect(wrapper).toBeDefined();
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });
  test('Inline message should be same with data-testid', () => {
    const wrapper = mount(createWrapper('the-inline-message'));
    expect(wrapper).toBeDefined();
    expect(wrapper.find('data-testid')).toBeTruthy();
  });
  describe('Inline message data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(createWrapper(testId));
        expect(wrapper.find('data-testid')).toBeTruthy();
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Inline message should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const inlineMessageBtn = 'the-inline-message--button';
      const inlineMessageComponent = 'the-inline-message';
      const inlineMessageTitle = 'the-inline-message--title';
      const inlineMessageText = 'the-inline-message--text';
      const inlineMessageContent = 'the-inline-message--inline-dialog';

      const { getByTestId } = render(createWrapper('the-inline-message'));
      expect(getByTestId(inlineMessageBtn)).toBeTruthy();
      expect(getByTestId(inlineMessageComponent)).toBeTruthy();
      expect(getByTestId(inlineMessageTitle)).toBeTruthy();
      expect(getByTestId(inlineMessageText)).toBeTruthy();
      // the content is only displayed when it is clicked on the inline-message.
      fireEvent.click(getByTestId(inlineMessageBtn));
      expect(getByTestId(inlineMessageContent)).toBeTruthy();
    });
  });
});
