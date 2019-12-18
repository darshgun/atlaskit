import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../../messages';

import { ToggleShowMoreArticles } from './styled';

export interface Props {
  minItemsToDisplay: number;
  maxItemsToDisplay: number;
  showMoreToggeled: boolean;
  toggleRelatedArticles: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export class ShowMoreArticlesButton extends React.Component<
  Props & InjectedIntlProps
> {
  render() {
    const {
      intl: { formatMessage },
      showMoreToggeled,
      toggleRelatedArticles,
      minItemsToDisplay,
      maxItemsToDisplay,
    } = this.props;

    if (showMoreToggeled) {
      return (
        <ToggleShowMoreArticles onClick={toggleRelatedArticles}>
          <FormattedMessage
            {...messages.help_panel_related_article_show_more}
            values={{
              numberOfRelatedArticlesLeft:
                maxItemsToDisplay > minItemsToDisplay
                  ? maxItemsToDisplay - minItemsToDisplay
                  : 0,
            }}
          />
        </ToggleShowMoreArticles>
      );
    } else {
      return (
        <ToggleShowMoreArticles onClick={toggleRelatedArticles}>
          {formatMessage(messages.help_panel_related_article_show_less)}
        </ToggleShowMoreArticles>
      );
    }
  }
}

export default injectIntl(ShowMoreArticlesButton);
