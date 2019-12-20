import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../../messages';
import { ArticleItem } from '../../../model/Article';

import RelatedArticlesContent from './RelatedArticlesContent';
import RelatedArticlesLoading from './RelatedArticlesLoading';

interface Props {
  // viewId used to get the related articles. This prop is optional.
  viewId?: string;
  // itemId used to get the related articles. This prop is optional.
  itemId?: string;
  // Function used to get related articles. This prop is optional, if is not defined the related articles will not be displayed
  onGetRelatedArticle?(
    viewId?: string,
    itemId?: string,
  ): Promise<ArticleItem[]>;
  /* function executed when the user clicks on of the related articles */
  onRelatedArticlesListItemClick?: (
    id: string,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

interface State {
  relatedArticles: ArticleItem[];
  isLoading: boolean;
  hasError: boolean;
}

const defaultValues = {
  relatedArticles: [],
  isLoading: true,
  hasError: false,
};

const initialiseHelpData = (data: State) => {
  return Object.assign(defaultValues, data);
};

export class RelatedArticles extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  constructor(props: Props & InjectedIntlProps) {
    super(props);

    this.state = initialiseHelpData({
      ...defaultValues,
    });

    this.updateRelatedArticles = this.updateRelatedArticles.bind(this);
  }

  componentDidMount() {
    this.updateRelatedArticles();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.viewId !== prevProps.viewId ||
      this.props.itemId !== prevProps.itemId
    ) {
      this.updateRelatedArticles();
    }
  }

  updateRelatedArticles() {
    if (this.props.onGetRelatedArticle) {
      const promiseRelatedArticles = this.props.onGetRelatedArticle(
        this.props.viewId,
        this.props.itemId,
      );
      promiseRelatedArticles
        .then(relatedArticles =>
          this.setState({ relatedArticles, isLoading: false, hasError: false }),
        )
        .catch(() => this.setState({ hasError: true }));
    } else {
      this.setState({ isLoading: false, hasError: false });
    }
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { relatedArticles, hasError, isLoading } = this.state;
    if (hasError) {
      return (
        <SectionMessage appearance="warning">
          <p>
            <b>
              {formatMessage(
                messages.help_panel_related_article_endpoint_error_title,
              )}
            </b>
          </p>
          <p>
            {formatMessage(
              messages.help_panel_related_article_endpoint_error_description,
            )}
          </p>
          <p>
            <Button
              appearance="link"
              spacing="compact"
              css={{ padding: '0', '& span': { margin: '0' } }}
              onClick={this.updateRelatedArticles}
            >
              Try again
            </Button>
          </p>
        </SectionMessage>
      );
    } else {
      return isLoading ? (
        <RelatedArticlesLoading />
      ) : (
        <RelatedArticlesContent
          relatedArticles={relatedArticles}
          onRelatedArticlesListItemClick={
            this.props.onRelatedArticlesListItemClick
          }
        />
      );
    }
  }
}

export default injectIntl(RelatedArticles);
