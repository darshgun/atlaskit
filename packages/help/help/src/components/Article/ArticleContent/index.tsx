import * as React from 'react';
import HelpArticle from '@atlaskit/help-article';

import { LoadingRectangle } from '../styled';

export interface Props {
  isLoading?: boolean;
  title?: string;
  body?: string;
  titleLinkUrl?: string;
}

const ArticleContent = (props: Props) => {
  const { isLoading = false, title = '', body = '', titleLinkUrl = '' } = props;

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

export default ArticleContent;
