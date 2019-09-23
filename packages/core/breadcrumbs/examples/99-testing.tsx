import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with many items, and a maximum to display set
  <div>
    <p>Should automatically collapse if there are more than 5 items</p>
    <div>
      <Breadcrumbs maxItems={5} testId="second-set-of-breadcrumbs">
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
      </Breadcrumbs>
    </div>
  </div>
);
