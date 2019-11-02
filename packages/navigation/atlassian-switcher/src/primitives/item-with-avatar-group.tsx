import * as React from 'react';
import styled from 'styled-components';
import { AvatarPropTypes } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';

import {
  createAndFireNavigationEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UI_EVENT_TYPE,
  SWITCHER_ITEM_SUBJECT,
} from '../utils/analytics';
import { FadeIn } from './fade-in';
import ThemedItem from './themed-item';

export interface ItemWithAvatarGroupProps extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  isDisabled?: boolean;
  onKeyDown?: any;
  onItemClick?: Function;
  onClick?: Function;
  users?: AvatarPropTypes[];
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  // make sure that it does not go beyond the navigation width
  // and always have the full width since we have avatars on the R.H.S.
  > div {
    width: 100%;
  }
`;

const noop = () => {};

class ItemWithAvatarGroup extends React.Component<ItemWithAvatarGroupProps> {
  onClick = () => {
    const { onItemClick, onClick, href } = this.props;
    onItemClick && onItemClick();
    onClick && onClick(href);
  };

  render() {
    const { icon, description, users = [], href, ...rest } = this.props;

    return (
      <FadeIn>
        <Wrapper>
          <ThemedItem
            description={description}
            icon={icon}
            avatarGroup={
              <AvatarGroup
                appearance="stack"
                data={users}
                maxCount={3}
                size="small"
                onMoreClick={noop}
              />
            }
            onClick={this.onClick}
            target="_new"
            {...rest}
          />
        </Wrapper>
      </FadeIn>
    );
  }
}

export default withAnalyticsEvents({
  onItemClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_SUBJECT,
  }),
})(ItemWithAvatarGroup);
