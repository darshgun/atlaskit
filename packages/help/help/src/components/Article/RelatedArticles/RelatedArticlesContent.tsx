import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ThemeProvider } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import { gridSize } from '@atlaskit/theme/constants';
import { ArticleItem } from '../../../model/Article';

import RelatedArticlesList from './RelatedArticlesList';
import ShowMoreArticlesButton from './ShowMoreArticlesButton';
import { RelatedArticlesContainer } from './styled';

const ITEM_THEME = {
  padding: {
    default: {
      bottom: gridSize(),
      left: gridSize(),
      top: gridSize(),
      right: gridSize(),
    },
  },
};

const MIN_ITEMS_TO_DISPLAY = 3;

interface Props {
  /* List of related articles. This prop is optional */
  relatedArticles?: ArticleItem[];
  /* Minimun number of articles to display. This prop is optional (Default value = 3) */
  minItemsToDisplay?: number;
  /* Minimun number of articles to display. This prop is optional (Default value = number of related articles)*/
  maxItemsToDisplay?: number;
  /* Function executed when the user clicks one of the related articles */
  onRelatedArticlesListItemClick?: (
    id: string,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

interface State {
  showMoreToggled: boolean;
}

export class RelatedArticlesContent extends React.Component<Props, State> {
  state = {
    showMoreToggled: true,
  };

  getNumberOfArticlesToDisplay = (showMoreToggeled: boolean) => {
    return showMoreToggeled
      ? this.getMinItemsToDisplay()
      : this.getMaxItemsToDisplay();
  };

  getMinItemsToDisplay: () => number = () => {
    return this.props.minItemsToDisplay
      ? this.props.minItemsToDisplay
      : MIN_ITEMS_TO_DISPLAY;
  };

  getMaxItemsToDisplay: () => number = () => {
    if (this.props.relatedArticles) {
      return this.props.maxItemsToDisplay
        ? this.props.maxItemsToDisplay
        : this.props.relatedArticles.length;
    }

    return 0;
  };

  toggleRelatedArticles = () => {
    this.setState({ showMoreToggled: !this.state.showMoreToggled });
  };

  render() {
    const { relatedArticles, onRelatedArticlesListItemClick } = this.props;

    // if there are related articles, display list of related articles
    return (
      relatedArticles &&
      relatedArticles.length > 0 && (
        <RelatedArticlesContainer>
          <ThemeProvider theme={{ [itemThemeNamespace]: ITEM_THEME }}>
            <>
              <RelatedArticlesList
                onRelatedArticlesListItemClick={onRelatedArticlesListItemClick}
                relatedArticles={relatedArticles}
                numberOfArticlesToDisplay={this.getNumberOfArticlesToDisplay(
                  this.state.showMoreToggled,
                )}
              />
              {relatedArticles.length > this.getMinItemsToDisplay() && (
                <ShowMoreArticlesButton
                  minItemsToDisplay={this.getMinItemsToDisplay()}
                  maxItemsToDisplay={this.getMaxItemsToDisplay()}
                  toggleRelatedArticles={this.toggleRelatedArticles}
                  showMoreToggeled={this.state.showMoreToggled}
                />
              )}
            </>
          </ThemeProvider>
        </RelatedArticlesContainer>
      )
    );
  }
}

export default RelatedArticlesContent;
