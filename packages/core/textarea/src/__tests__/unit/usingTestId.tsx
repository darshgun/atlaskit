import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import TextArea from '../../components/TextArea';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<TextArea value="hello" />);
    expect(wrapper).toBeDefined();
    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });

  test('Textarea snapshot should be same with data-testid', () => {
    const wrapper = mount(<TextArea value="hello" testId="the-textarea" />);
    expect(
      wrapper.find('[data-testid="the-textarea"]').hostNodes(),
    ).toHaveLength(1);
  });

  describe('Textarea data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(<TextArea value="hello" testId={testId} />);
        expect(
          wrapper.find(`[data-testid='${testId}']`).hostNodes(),
        ).toHaveLength(1);
      },
      [
        { testId: 'AnY' },
        { testId: '$%#%#()+_' },
        { testId: 123 },
        { testId: '123;*&' },
      ],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Textarea should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-textarea';
      const { getByTestId } = render(
        <TextArea value="hello" testId={testId} />,
      );

      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
