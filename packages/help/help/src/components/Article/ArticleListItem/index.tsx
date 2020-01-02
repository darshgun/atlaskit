import * as React from 'react';
import * as colors from '@atlaskit/theme/colors';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { withAnalyticsEvents, withAnalyticsContext } from '../../../analytics';
import { Analytics } from '../../../model/Analytics';
import { ArticleItem, ARTICLE_ITEM_TYPES } from '../../../model/Article';
import { messages } from '../../../messages';

import {
  ArticlesListItemTypeTitle,
  ArticlesListItemWrapper,
  ArticlesListItemContainer,
  ArticlesListItemTitleText,
  ArticlesListItemDescription,
  ArticlesListItemLinkIcon,
} from './styled';

type Props = {
  // Aditional Styles
  styles?: {};
  /* Analytics event */
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  /* Function executed when the user clicks the related article */
  onClick?: (id: string, analyticsEvent: UIAnalyticsEvent) => void;
};

const getTypeTitle = (itemType?: ARTICLE_ITEM_TYPES) => {
  switch (itemType) {
    case ARTICLE_ITEM_TYPES.helpArticle:
      return messages.help_panel_related_article_type_help_article;

    case ARTICLE_ITEM_TYPES.whatsNew:
      return messages.help_panel_related_article_type_whats_new;

    default:
      return null;
  }
};

const ArticlesListItem: React.SFC<Props &
  ArticleItem &
  InjectedIntlProps &
  Analytics> = (props: Props & ArticleItem & InjectedIntlProps & Analytics) => {
  const {
    intl: { formatMessage },
    styles,
    id,
    title = '',
    description = '',
    href = '',
    type, // This needs to come from algolia
    onClick = (id: string, analyticsEvent: UIAnalyticsEvent) => {},
    createAnalyticsEvent,
  } = props;

  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (onClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });

      onClick(id, analyticsEvent);
    }
  };

  const typeTitle = getTypeTitle(type);

  return (
    <ArticlesListItemWrapper
      styles={styles}
      aria-disabled="false"
      role="button"
      href={href}
      onClick={handleOnClick}
    >
      <ArticlesListItemContainer>
        {typeTitle && (
          <ArticlesListItemTypeTitle>
            {formatMessage(typeTitle)}
          </ArticlesListItemTypeTitle>
        )}
        <ArticlesListItemTitleText>{title}</ArticlesListItemTitleText>
        {href && (
          <ArticlesListItemLinkIcon>
            <ShortcutIcon
              size="small"
              label=""
              primaryColor={colors.N90}
              secondaryColor={colors.N90}
            />
          </ArticlesListItemLinkIcon>
        )}
      </ArticlesListItemContainer>
      <ArticlesListItemDescription>{description}</ArticlesListItemDescription>
    </ArticlesListItemWrapper>
  );
};

export default withAnalyticsContext({
  componentName: 'ArticleListItem',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(injectIntl(ArticlesListItem)));
