import { mount, shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { colors } from '@atlaskit/theme';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import React from 'react';
import cases from 'jest-in-case';
import Flag from '../../Flag';

describe('Using enzyme', () => {
  test('Flag > it should not generate data-testid', () => {
    const wrapper = mount(
      <Flag
        actions={[
          { content: 'Show me', onClick: () => {} },
          { content: 'No thanks', onClick: () => {} },
        ]}
        icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
        description="We got fun an games. We got everything you want honey, we know the names."
        id="1"
        key="1"
        title="Welcome to the jungle"
      />,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.text()).toContain(
      'We got fun an games. We got everything you want honey, we know the names.',
    );
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });
  test('Flag > it should have data-testid ', () => {
    const wrapper = shallow(
      <Flag
        actions={[
          { content: 'Show me', onClick: () => {} },
          { content: 'No thanks', onClick: () => {} },
        ]}
        icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
        description="We got fun an games. We got everything you want honey, we know the names."
        id="1"
        key="1"
        title="Welcome to the jungle"
        testId="MyFlagTestId"
      />,
    );
    expect(wrapper.find('[data-testid="MyFlagTestId"]')).toBeDefined();
  });
  test('Flag actions should have data-testid ', () => {
    const wrapper = shallow(
      <Flag
        actions={[
          {
            content: 'Show me',
            onClick: () => {},
            testId: 'MyFlagActionTestId',
          },
          { content: 'No thanks', onClick: () => {} },
        ]}
        icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
        description="We got fun an games. We got everything you want honey, we know the names."
        id="1"
        key="1"
        title="Welcome to the jungle"
      />,
    );
    expect(wrapper.find('[data-testid="MyFlagActionTestId"]')).toBeDefined();
  });
  describe('Flag with different data-testid', () => {
    cases(
      'should be generated',
      ({ key }: { key: string }) => {
        const wrapper = shallow(
          <Flag
            actions={[
              { content: 'Show me', onClick: () => {} },
              { content: 'No thanks', onClick: () => {} },
            ]}
            icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
            description="We got fun an games. We got everything you want honey, we know the names."
            id="1"
            key="1"
            title="Welcome to the jungle"
            testId="MyFlagTestId"
          />,
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
  describe('Flag should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const { getByTestId } = render(
        <Flag
          actions={[
            { content: 'Show me', onClick: () => {} },
            { content: 'No thanks', onClick: () => {} },
          ]}
          icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
          description="We got fun an games. We got everything you want honey, we know the names."
          id="1"
          key="1"
          title="Welcome to the jungle"
          testId="MyFlagTestId"
        />,
      );
      expect(getByTestId('MyFlagTestId')).toBeTruthy();
    });
  });
  describe('Flag actions should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const { getByTestId } = render(
        <Flag
          actions={[
            {
              content: 'Show me',
              onClick: () => {},
              testId: 'MyFlagActionTestId',
            },
            { content: 'No thanks', onClick: () => {} },
          ]}
          icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
          description="We got fun an games. We got everything you want honey, we know the names."
          id="1"
          key="1"
          title="Welcome to the jungle"
        />,
      );
      expect(getByTestId('MyFlagActionTestId')).toBeTruthy();
    });
  });
});
