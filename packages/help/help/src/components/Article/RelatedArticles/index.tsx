import * as React from 'react';

import { ArticleItem } from '../../../model/Article';

import RelatedArticlesContent from './RelatedArticlesContent';
import RelatedArticlesLoading from './RelatedArticlesLoading';

interface Props {
  isLoading?: boolean;
  relatedArticles?: ArticleItem[];
}

const RelatedArticles: React.SFC<Props> = (props: Props) => {
  const { relatedArticles, isLoading } = props;

  return isLoading ? (
    <RelatedArticlesLoading />
  ) : (
    <RelatedArticlesContent relatedArticles={relatedArticles} />
  );
};

RelatedArticles.defaultProps = {
  isLoading: false,
  relatedArticles: [],
};

export default RelatedArticles;
