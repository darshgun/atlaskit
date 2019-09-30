import * as React from 'react';
import * as colors from '@atlaskit/theme/colors';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
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

type Props = {
  /* Analytics event */
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  /* Function executed when the user clicks the related article */
  onClick?: (id: string, analyticsEvent: UIAnalyticsEvent) => void;
  /* Related article title. This prop is optional (default value is '') */
  title?: string;
  /* Related article description. This prop is optional (default value is '') */
  description?: string;
  /* Related article icon. This prop is optional (by default a DocumentFilledIcon is used) */
  icon?: React.ReactNode;
  /* Related article href. This prop is optional (default value is ''). If is defined, when 
  the user clicks in the related article a new tab will be open using the url defined in this prop */
  href?: string;
  /* Related article ID */
  id: string;
};

const ArticlesListItem: React.SFC<Props & Analytics> = (
  props: Props & Analytics,
) => {
  const {
    id,
    title = '',
    description = '',
    icon = (
      <DocumentFilledIcon primaryColor={colors.P300} size="medium" label="" />
    ),
    href = '',
    onClick = (id: string, analyticsEvent: UIAnalyticsEvent) => {},
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
      href={href}
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
