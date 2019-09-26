import * as React from 'react';
import * as colors from '@atlaskit/theme/colors';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { withAnalyticsEvents, withAnalyticsContext } from '../../../analytics';
import { Analytics } from '../../../model/Analytics';

import {
  ArticlesListItemTitleIcon,
  ArticlesListItemWrapper,
  ArticlesListItemTitle,
  ArticlesListItemTitleText,
  ArticlesListItemDescription,
  ArticlesListItemLinkIcon,
} from './styled';

interface Props {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  onClick: (id: string, analyticsEvent: UIAnalyticsEvent) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  id: string;
}

const ArticlesListItem: React.SFC<Props & Analytics> = (
  props: Props & Analytics,
) => {
  const {
    id,
    title,
    description,
    icon,
    onClick,
    href,
    createAnalyticsEvent,
  } = props;

  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (onClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'click',
      });

      onClick(id, analyticsEvent);
    }
  };

  return (
    <ArticlesListItemWrapper
      aria-disabled="false"
      role="button"
      href={href ? href : ''}
      onClick={handleOnClick}
    >
      <ArticlesListItemTitle>
        <ArticlesListItemTitleIcon>{icon}</ArticlesListItemTitleIcon>
        <ArticlesListItemTitleText>{title}</ArticlesListItemTitleText>
        {href && (
          <ArticlesListItemLinkIcon>
            <ShortcutIcon
              size="small"
              label={title}
              primaryColor={colors.N90}
              secondaryColor={colors.N90}
            />
          </ArticlesListItemLinkIcon>
        )}
      </ArticlesListItemTitle>
      <ArticlesListItemDescription>{description}</ArticlesListItemDescription>
    </ArticlesListItemWrapper>
  );
};

export default withAnalyticsContext({
  componentName: 'ArticleListItem',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(ArticlesListItem));
