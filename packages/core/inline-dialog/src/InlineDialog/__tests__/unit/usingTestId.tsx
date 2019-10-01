import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';
import { InlineDialogWithoutAnalytics as InlineDialog } from '../..';
import { Container } from '../../styled';

jest.mock('popper.js', () => {
  // @ts-ignore requireActual property is missing from jest
  const PopperJS = jest.requireActual('popper.js');

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
      };
    }
  };
});
describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <InlineDialog content={() => null} isOpen>
        <div id="children" />
      </InlineDialog>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find(Container).exists()).toBe(true);
    expect(wrapper.find(Container).prop('data-testid')).toBeUndefined();
  });
  test('Inline dialog should be same with data-testid', () => {
    const wrapper = mount(
      <InlineDialog content={() => null} testId="the-inline-dialog" isOpen>
        <div id="children" />
      </InlineDialog>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.find(Container).exists()).toBe(true);
    expect(wrapper.find(Container).prop('data-testid')).toBeDefined();
  });
  describe('Inline dialog data-testid should be stable and predictable', () => {
    cases(
      'should be generated',
      ({ testId }: { testId: string }) => {
        const wrapper = mount(
          <InlineDialog content={() => null} testId={testId} isOpen>
            <div id="children" />
          </InlineDialog>,
        );
        expect(wrapper.find(Container).exists()).toBe(true);
        expect(wrapper.find(Container).prop('data-testid')).toBeDefined();
      },
      [{ testId: 'AnY' }, { testId: '$%#%#()+_' }, { testId: '123;*&' }],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Inline dialog should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-inline-dialog';
      const { getByTestId } = render(
        <InlineDialog content={() => null} testId={testId} isOpen>
          <div id="children" />
        </InlineDialog>,
      );
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
