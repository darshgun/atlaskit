import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ArticleItem } from '../../../model/Article';
import RelatedArticlesListItem from '../ArticleListItem';

type Props = {
  /* List of related articles. This prop is optional */
  relatedArticles?: ArticleItem[];
  /* Number of articles to diplay. This prop is optional (default value is 5) */
  numberOfArticlesToDisplay?: number;
  /* Function executed when the user clicks one of the related articles */
  onRelatedArticlesListItemClick?: (
    id: string,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
};

const RelatedArticlesList: React.SFC<Props> = (props: Props) => {
  const {
    relatedArticles = [],
    numberOfArticlesToDisplay = 5,
    onRelatedArticlesListItemClick,
  } = props;

  return (
    relatedArticles && (
      <>
        {relatedArticles
          .slice(0, numberOfArticlesToDisplay)
          .map((relatedArticle: ArticleItem) => (
            <RelatedArticlesListItem
              id={relatedArticle.id}
              onClick={onRelatedArticlesListItemClick}
              title={relatedArticle.title}
              description={relatedArticle.description}
              key={relatedArticle.id}
              href={relatedArticle.href}
            />
          ))}
      </>
    )
  );
};

export default RelatedArticlesList;
