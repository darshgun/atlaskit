/** @jsx jsx */
import Button from '@atlaskit/button';
import { jsx } from '@emotion/core';
import { ChangeEvent, Fragment, useState } from 'react';

import { AtlassianNavigation } from '../src';
import { NavigationSkeleton } from '../src/skeleton';

import { DefaultCreate } from './shared/Create';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';

import { ProfilePopup } from './shared/ProfilePopup';
import { SwitcherPopup } from './shared/SwitcherPopup';
import { HelpPopup } from './shared/HelpPopup';
import { NotificationsPopup } from './shared/NotificationsPopup';

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
        <AtlassianNavigation
          primaryItems={defaultPrimaryItems}
          renderAppSwitcher={SwitcherPopup}
          renderCreate={DefaultCreate}
          renderHelp={HelpPopup}
          renderNotifications={NotificationsPopup}
          renderProductHome={DefaultProductHome}
          renderProfile={ProfilePopup}
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
