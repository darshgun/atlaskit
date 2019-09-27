import * as React from 'react';
import * as colors from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { ArticleItem } from '../../../model/Article';
import { withHelp, HelpContextInterface } from '../../HelpContext';
import RelatedArticlesListItem from '../ArticleListItem';

interface Props {
  relatedArticles?: ArticleItem[];
  numberOfArticlesToDisplay: number;
}

const RelatedArticlesList: React.SFC<Props & HelpContextInterface> = (
  props: Props & HelpContextInterface,
) => {
  const { relatedArticles, numberOfArticlesToDisplay, help } = props;

  if (relatedArticles) {
    return (
      <>
        {relatedArticles
          .slice(0, numberOfArticlesToDisplay)
          .map(relatedArticle => {
            return (
              <RelatedArticlesListItem
                id={relatedArticle.id}
                onClick={() => {
                  help.loadArticle(relatedArticle.id);
                }}
                title={relatedArticle.title}
                description={relatedArticle.description}
                key={relatedArticle.id}
                href={relatedArticle.href}
                icon={
                  <DocumentFilledIcon
                    primaryColor={colors.P300}
                    size="medium"
                    label={relatedArticle.title}
                  />
                }
              />
            );
          })}
      </>
    );
  }

  return null;
};

export default withHelp(RelatedArticlesList);
