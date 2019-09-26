import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Textfield from '../../Textfield';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<Textfield value="hello" />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });

  test('Textfield snapshot should be same with data-testid', () => {
    const wrapper = mount(<Textfield value="hello" testId="the-textfield" />);
    expect(
      wrapper.find('[data-testid="the-textfield"]').hostNodes(),
    ).toHaveLength(1);
  });

  describe('Textfield data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(<Textfield value="hello" testId={testId} />);
        expect(
          wrapper.find(`[data-testid='${testId}']`).hostNodes(),
        ).toHaveLength(1);
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Textfield should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-textfield';
      const { getByTestId } = render(
        <Textfield value="hello" testId={testId} />,
      );

      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
