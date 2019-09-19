/** @jsx jsx */
import Button from '@atlaskit/button';
import { jsx } from '@emotion/core';
import { Fragment, useState, ChangeEvent } from 'react';
import { NavigationContainer, NavigationSkeleton } from '../src';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { DefaultNotifications } from './shared/Notifications';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';

const controlsCSS = {
  alignItems: 'center',
  display: 'flex',
  margin: '1rem',
};

const labelCSS = {
  margin: '1rem',
};

const inputCSS = {
  width: '3rem',
};

const InteractiveSkeletonExample = () => {
  const [isSkeleton, setIsSkeleton] = useState(true);
  const [itemCounts, setItemCounts] = useState({ primary: 4, secondary: 4 });
  const { primary, secondary } = itemCounts;

  const setCounts = (key: string) => ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    setItemCounts({
      ...itemCounts,
      [key]: parseInt(value),
    });

  return (
    <Fragment>
      {isSkeleton ? (
        <NavigationSkeleton
          primaryItemsCount={primary}
          secondaryItemsCount={secondary}
        />
      ) : (
        <NavigationContainer
          primaryItems={defaultPrimaryItems}
          renderAppSwitcher={DefaultAppSwitcher}
          renderCreate={DefaultCreate}
          renderHelp={DefaultHelp}
          renderNotifications={DefaultNotifications}
          renderProductHome={DefaultProductHome}
          renderProfile={DefaultProfile}
          renderSearch={DefaultSearch}
          renderSettings={DefaultSettings}
        />
      )}
      <div css={controlsCSS}>
        <Button onClick={() => setIsSkeleton(!isSkeleton)}>
          Show {isSkeleton ? 'Navigation' : 'Skeleton'}
        </Button>
        <label css={labelCSS} htmlFor="primary">
          Primary Items
        </label>
        <input
          css={inputCSS}
          id="primary"
          max="4"
          min="0"
          onChange={setCounts('primary')}
          type="number"
          value={primary}
        />
        <label css={labelCSS} htmlFor="secondary">
          Secondary Items
        </label>
        <input
          css={inputCSS}
          id="secondary"
          max="4"
          min="0"
          onChange={setCounts('secondary')}
          type="number"
          value={secondary}
        />
      </div>
    </Fragment>
  );
};

export default InteractiveSkeletonExample;
