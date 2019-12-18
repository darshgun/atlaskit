import * as React from 'react';

import { LoadingRectangle } from '../styled';
import {
  LoadignRelatedArticleList,
  LoadignRelatedArticleListItem,
} from './styled';

const RelatedArticlesLoading = () => {
  return (
    <>
      <LoadignRelatedArticleList>
        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
        </LoadignRelatedArticleListItem>

        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
        </LoadignRelatedArticleListItem>

        <LoadignRelatedArticleListItem>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
          <LoadingRectangle contentWidth="100%" marginTop="4px" />
        </LoadignRelatedArticleListItem>
      </LoadignRelatedArticleList>
    </>
  );
};

export default RelatedArticlesLoading;
