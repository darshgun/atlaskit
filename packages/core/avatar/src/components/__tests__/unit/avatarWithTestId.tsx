import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Avatar from '../../Avatar';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<Avatar name="xxlarge" size="xxlarge" />);
    expect(wrapper).toBeDefined();
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });

  test('Avatar snapshot should be same with data-testid', () => {
    const wrapper = mount(
      <Avatar name="xxlarge" size="xxlarge" testId="the-avatar" />,
    );
    expect(wrapper.find('[data-testid="the-avatar"]')).toMatchSnapshot();
  });

  describe('Avatars with different data-testid', () => {
    cases(
      'should be generated',
      ({ key }: { key: string }) => {
        const wrapper = mount(
          <Avatar name="xxlarge" size="xxlarge" testId={key} />,
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
      const testId = 'the-avatar';
      const { getByTestId } = render(
        <Avatar name="xxlarge" size="xxlarge" testId={testId} />,
      );

      expect(getByTestId(testId)).toBeTruthy();
    });

    test('Using container snapshot', () => {
      const { container } = render(
        <Avatar name="xxlarge" size="xxlarge" testId="the-avatar" />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
