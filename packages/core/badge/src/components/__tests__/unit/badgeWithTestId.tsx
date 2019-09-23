import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Badge from '../..';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <Badge appearance="added" max={99}>
        3000
      </Badge>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });

  test('Badge snapshot should be same with data-testid', () => {
    const wrapper = mount(
      <Badge appearance="added" max={99} testId="myBadge">
        3000
      </Badge>,
    );
    expect(wrapper.find('[data-testid="myBadge"]')).toMatchSnapshot();
  });

  describe('Badge with different data-testid', () => {
    cases(
      'should be generated',
      ({ key }: { key: string }) => {
        const wrapper = mount(
          <Badge appearance="added" max={99} testId={key}>
            3000
          </Badge>,
        );
        expect(wrapper.find(`[data-testid='${key}']`)).toBeTruthy();
      },
      [
        { key: 'josefGiTan' },
        { key: 'ZZZZŹŽ;;;;' },
        { key: '@3$&&&&Helooo' },
        { key: '126^^^' },
        { key: 123 },
      ],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Button should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-badge';
      const { getByTestId } = render(
        <Badge appearance="added" max={99} testId={testId}>
          3000
        </Badge>,
      );

      expect(getByTestId(testId)).toBeTruthy();
    });

    test('Using container snapshot', () => {
      const testId = 'the-badge';
      const { container } = render(
        <Badge appearance="added" max={99} testId={testId}>
          3000
        </Badge>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
