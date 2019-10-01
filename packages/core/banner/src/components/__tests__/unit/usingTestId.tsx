import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Banner from '../../Banner';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <Banner isOpen>
        Your license is about to expire. Please renew your license within the
        next week.
      </Banner>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });

  test('Banner snapshot should be same with data-testid', () => {
    const wrapper = mount(
      <Banner isOpen testId="the-banner">
        Your license is about to expire. Please renew your license within the
        next week.
      </Banner>,
    );
    expect(wrapper.find('[data-testid="the-banner"]')).toMatchSnapshot();
  });

  describe('Banner with different data-testid', () => {
    cases(
      'should be generated',
      ({ key }: { key: string }) => {
        const wrapper = mount(
          <Banner isOpen testId={key}>
            Your license is about to expire. Please renew your license within
            the next week.
          </Banner>,
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
  describe('Banner should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-banner';
      const { getByTestId } = render(
        <Banner isOpen testId="the-banner">
          Your license is about to expire. Please renew your license within the
          next week.
        </Banner>,
      );

      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
