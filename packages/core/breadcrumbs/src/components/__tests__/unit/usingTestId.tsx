import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Breadcrumbs from '../../Breadcrumbs';
import BreadcrumbsItem from '../../BreadcrumbsItem';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <Breadcrumbs maxItems={5}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
        <BreadcrumbsItem
          href="/item"
          text="A fourth item with a very long name"
        />
        <BreadcrumbsItem href="/item" text="Item 5" />
        <BreadcrumbsItem href="/item" text="A sixth item" />
      </Breadcrumbs>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.prop('data-testid')).toBeUndefined();
    wrapper.unmount();
  });

  test('Breadcrumbs snapshot should be same with data-testid', () => {
    const wrapper = mount(
      <Breadcrumbs maxItems={5} testId="set-of-breadcrumbs">
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          testId="breadcrumb-to-find"
        />
        <BreadcrumbsItem href="/item" text="A third item" />
        <BreadcrumbsItem
          href="/item"
          text="A fourth item with a very long name"
        />
        <BreadcrumbsItem href="/item" text="Item 5" />
        <BreadcrumbsItem href="/item" text="A sixth item" />
      </Breadcrumbs>,
    );
    expect(wrapper.exists('[data-testid="set-of-breadcrumbs"]')).toBeTruthy();
    expect(wrapper.exists('[data-testid="breadcrumb-to-find"]')).toBeFalsy();

    // console.log(wrapper.debug());
    const ellipsis = wrapper.find(
      '[data-testid="set-of-breadcrumbs--breadcrumb-ellipsis"]',
    );
    ellipsis.simulate('click');

    expect(wrapper.exists('[data-testid="breadcrumb-to-find"]')).toBeTruthy();
    wrapper.unmount();
  });

  describe('Breadcrumbs with different data-testid', () => {
    cases(
      'should be generated',
      ({ key, subkeys }: { key: string; subkeys: string[] }) => {
        const wrapper = mount(
          <Breadcrumbs maxItems={5} testId={key}>
            {subkeys.map(subkey => (
              <BreadcrumbsItem
                key={subkey}
                href="/item"
                text="Another item"
                testId={subkey}
              />
            ))}
          </Breadcrumbs>,
        );
        expect(wrapper.find(`[data-testid='${key}']`)).toBeTruthy();
        expect(
          wrapper.find(`[data-testid='${key}--breadcrumb-ellipsis']`),
        ).toBeTruthy();
        subkeys.forEach(subkey => {
          expect(wrapper.find(`[data-testid='${subkey}']`)).toBeTruthy();
        });
      },
      [
        { key: 'first-set-of-breadcrumbs', subkeys: ['a', 'b', 'c'] },
        { key: 'second-set-of-breadcrumbs', subkeys: ['a', 'b'] },
      ],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Breadcrumbs should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'set-of-breadcrumbs';
      const { getByTestId } = render(
        <Breadcrumbs maxItems={5} testId={testId}>
          <BreadcrumbsItem href="/item" text="Item" />
          <BreadcrumbsItem
            href="/item"
            text="Another item"
            testId="breadcrumb-to-find"
          />
          <BreadcrumbsItem href="/item" text="A third item" />
          <BreadcrumbsItem
            href="/item"
            text="A fourth item with a very long name"
          />
          <BreadcrumbsItem href="/item" text="Item 5" />
          <BreadcrumbsItem href="/item" text="A sixth item" />
        </Breadcrumbs>,
      );

      const ellipsis = getByTestId(testId + '--breadcrumb-ellipsis');

      expect(getByTestId(testId)).toBeTruthy();
      expect(ellipsis).toBeTruthy();
      expect(getByTestId('breadcrumb-to-find')).toBeFalsy();

      ellipsis.click();

      expect(getByTestId(testId + '--breadcrumb-ellipsis')).toBeFalsy();
      expect(getByTestId('breadcrumb-to-find')).toBeTruthy();
    });
  });
});
