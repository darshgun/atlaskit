import * as React from 'react';
import styled from 'styled-components';
import AvatarGroup from '@atlaskit/avatar-group';

import { JoinableSiteUser } from '../types';
import { WithAnalyticsEventsProps } from '../utils/analytics';
import { FadeIn } from './fade-in';
import ThemedItem from './themed-item';

export interface ItemWithAvatarGroupProps extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onClick?: Function;
  href?: string;
  isDisabled?: boolean;
  onKeyDown?: any;
  users?: JoinableSiteUser[];
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

export default class ItemWithAvatarGroup extends React.Component<
  ItemWithAvatarGroupProps
> {
  render() {
    const { icon, description, users = [], ...rest } = this.props;

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
              />
            }
            {...rest}
          />
        </Wrapper>
      </FadeIn>
    );
  }
}
