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

    expect(wrapper.find(`[data-testid]`).hostNodes()).toHaveLength(0);
  });

  test('Breadcrumbs snapshot should be same with data-testid', () => {
    const breadcrumbsId = 'set-of-breadcrumbs';
    const ellipsisId = `${breadcrumbsId}--breadcrumb-ellipsis`;
    const breadcrumbToFindId = 'breadcrumb-to-find';
    const lastBreadcrumbId = 'last-breadcrumb';

    const wrapper = mount(
      <Breadcrumbs maxItems={5} testId={breadcrumbsId}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem
          href="/item"
          text="Another item"
          testId={breadcrumbToFindId}
        />
        <BreadcrumbsItem href="/item" text="A third item" />
        <BreadcrumbsItem
          href="/item"
          text="A fourth item with a very long name"
        />
        <BreadcrumbsItem href="/item" text="Item 5" />
        <BreadcrumbsItem
          href="/item"
          text="A sixth item"
          testId={lastBreadcrumbId}
        />
      </Breadcrumbs>,
    );

    expect(wrapper).toMatchSnapshot();

    expect(
      wrapper.find(`[data-testid="${breadcrumbsId}"]`).hostNodes(),
    ).toHaveLength(1);
    expect(
      wrapper.find(`[data-testid="${ellipsisId}"]`).hostNodes(),
    ).toHaveLength(1);
    expect(
      wrapper.find(`[data-testid="${breadcrumbToFindId}"]`).hostNodes(),
    ).toHaveLength(0);

    wrapper
      .find(`[data-testid="${ellipsisId}"]`)
      .hostNodes()
      .simulate('click');

    expect(
      wrapper.find(`[data-testid="${ellipsisId}"]`).hostNodes(),
    ).toHaveLength(0);
    expect(
      wrapper.find(`[data-testid="${breadcrumbToFindId}"]`).hostNodes(),
    ).toHaveLength(1);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('Using react-testing-library', () => {
  describe('Breadcrumbs should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const breadcrumbsId = 'last-set-of-breadcrumbs';
      const ellipsisId = `${breadcrumbsId}--breadcrumb-ellipsis`;
      const breadcrumbToFindId = 'breadcrumb-to-find';
      const lastBreadcrumbId = 'last-breadcrumb';

      const { getByTestId, queryByTestId } = render(
        <Breadcrumbs maxItems={5} testId={breadcrumbsId}>
          <BreadcrumbsItem href="/item" text="Item" />
          <BreadcrumbsItem
            href="/item"
            text="Another item"
            testId={breadcrumbToFindId}
          />
          <BreadcrumbsItem href="/item" text="A third item" />
          <BreadcrumbsItem
            href="/item"
            text="A fourth item with a very long name"
          />
          <BreadcrumbsItem href="/item" text="Item 5" />
          <BreadcrumbsItem
            href="/item"
            text="A sixth item"
            testId={lastBreadcrumbId}
          />
        </Breadcrumbs>,
      );

      const ellipsis = getByTestId(ellipsisId);

      expect(getByTestId(breadcrumbsId)).toBeTruthy();
      expect(ellipsis).toBeTruthy();
      expect(queryByTestId(breadcrumbToFindId)).toBeNull();

      ellipsis.click();

      expect(queryByTestId(ellipsisId)).toBeNull();
      expect(getByTestId(breadcrumbToFindId)).toBeTruthy();
    });
  });
});
