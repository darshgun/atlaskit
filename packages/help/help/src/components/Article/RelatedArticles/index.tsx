import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ArticleItem } from '../../../model/Article';

import RelatedArticlesContent from './RelatedArticlesContent';
import RelatedArticlesLoading from './RelatedArticlesLoading';

interface Props {
  /* Display loading state. This prop is optional */
  isLoading?: boolean;
  /* List of related articles. This prop is optional */
  relatedArticles?: ArticleItem[];
  /* function executed when the user clicks on of the related articles */
  onRelatedArticlesListItemClick?: (
    id: string,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

const RelatedArticles: React.SFC<Props> = (props: Props) => {
  const {
    isLoading = false,
    relatedArticles = [],
    onRelatedArticlesListItemClick,
  } = props;

  return isLoading ? (
    <RelatedArticlesLoading />
  ) : (
    <RelatedArticlesContent
      relatedArticles={relatedArticles}
      onRelatedArticlesListItemClick={onRelatedArticlesListItemClick}
    />
  );
};

export default RelatedArticles;
