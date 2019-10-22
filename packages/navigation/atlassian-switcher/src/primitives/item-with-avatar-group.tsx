import * as React from 'react';
import styled from 'styled-components';
import AvatarGroup from '@atlaskit/avatar-group';

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
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemWrapper = styled.div`
  max-width: 70%;
`;

export default class ItemWithAvatarGroup extends React.Component<
  ItemWithAvatarGroupProps
> {
  render() {
    const { icon, description, users = {}, ...rest } = this.props;

    return (
      <FadeIn>
        <Wrapper>
          <ItemWrapper>
            <ThemedItem elemBefore={icon} description={description} {...rest} />
          </ItemWrapper>
          <div>
            <AvatarGroup
              appearance="stack"
              data={users}
              maxCount={3}
              size="small"
            />
          </div>
        </Wrapper>
      </FadeIn>
    );
  }
}
