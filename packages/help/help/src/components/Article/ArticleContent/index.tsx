import * as React from 'react';
import HelpArticle from '@atlaskit/help-article';

import { LoadingRectangle } from '../styled';

type HelpArticleType = typeof HelpArticle.defaultProps;

export interface Props {
  isLoading?: boolean;
}

const ArticleContent = (props: Props & HelpArticleType) => {
  const { isLoading, title, body, titleLinkUrl } = props;

  return isLoading ? (
    <>
      <div>
        <LoadingRectangle contentHeight="20px" marginTop="0" />
        <LoadingRectangle contentWidth="90%" />
        <LoadingRectangle contentWidth="80%" />
        <LoadingRectangle contentWidth="80%" />
        <LoadingRectangle contentWidth="70%" />
      </div>
    </>
  ) : (
    <HelpArticle title={title} body={body} titleLinkUrl={titleLinkUrl} />
  );
};

ArticleContent.defaultProps = {
  isLoading: false,
};

export default ArticleContent;
