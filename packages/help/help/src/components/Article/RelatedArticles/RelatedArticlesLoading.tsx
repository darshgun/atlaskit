import * as React from 'react';

import { LoadingRectangle } from '../styled';
import {
  LoadignRelatedArticleList,
  LoadignRelatedArticleListItem,
  LoadignRelatedArticleListItemText,
  LoadignRelatedArticleSection,
} from './styled';

const RelatedArticlesLoading = () => {
  return (
    <LoadignRelatedArticleSection>
      <LoadingRectangle contentHeight="8px" contentWidth="40px" marginTop="0" />
      <LoadignRelatedArticleList>
        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentWidth="40px"
            contentHeight="40px"
            marginTop="0"
          />
          <LoadignRelatedArticleListItemText>
            <LoadingRectangle marginTop="0" contentWidth="100%" />
            <LoadingRectangle contentWidth="100%" />
          </LoadignRelatedArticleListItemText>
        </LoadignRelatedArticleListItem>

        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentWidth="40px"
            contentHeight="40px"
            marginTop="0"
          />
          <LoadignRelatedArticleListItemText>
            <LoadingRectangle marginTop="0" contentWidth="100%" />
            <LoadingRectangle contentWidth="100%" />
          </LoadignRelatedArticleListItemText>
        </LoadignRelatedArticleListItem>

        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentWidth="40px"
            contentHeight="40px"
            marginTop="0"
          />
          <LoadignRelatedArticleListItemText>
            <LoadingRectangle marginTop="0" contentWidth="100%" />
            <LoadingRectangle contentWidth="100%" />
          </LoadignRelatedArticleListItemText>
        </LoadignRelatedArticleListItem>
      </LoadignRelatedArticleList>
    </LoadignRelatedArticleSection>
  );
};

export default RelatedArticlesLoading;
