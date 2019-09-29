import React from 'react';
import { mount, shallow } from 'enzyme';
import { InlineDialogWithoutAnalytics as InlineDialog } from '../..';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <InlineDialog content={() => null}>
        <div id="children" />
      </InlineDialog>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });
  test('Inline-ialog snapshot should be same with data-testid', () => {
    const wrapper = mount(
      <InlineDialog content={() => null} testId="the-inline-dialog">
        <div id="children" />
      </InlineDialog>,
    );
    expect(
      wrapper.find('[data-testid="the-inline-dialog"]').hostNodes(),
    ).toHaveLength(1);
  });
  describe('Inline dialog data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(
          <InlineDialog content={() => null} testId={testId}>
            <div id="children" />
          </InlineDialog>,
        );
        expect(
          wrapper.find(`[data-testid='${testId}']`).hostNodes(),
        ).toHaveLength(1);
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Inline dialog should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-textarea';
      const { getByTestId } = render(
        <TextArea value="hello" testId={testId} />,
      );

      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
