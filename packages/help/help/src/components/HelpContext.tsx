import React, { createContext } from 'react';
import { withAnalyticsEvents } from '../analytics';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { Article, ArticleItem, ArticleFeedback } from '../model/Article';
import { REQUEST_STATE } from '../model/Requests';

import { MIN_CHARACTERS_FOR_SEARCH, VIEW, LOADING_TIMEOUT } from './constants';

export interface HistoryItem {
  uid: number;
  id: string;
  state: REQUEST_STATE;
  article?: Article;
}

export interface Props {
  // Id of the article to display. This prop is optional, if is not defined the default content will be displayed
  articleId?: string;
  // Setter for the articleId. This prop is optional, if is not defined, the back button will not be visible
  articleIdSetter?(id: string): void;
  // Function used to get an article content. This prop is optional, if is not defined the default content will be displayed
  onGetArticle?(id: string): Promise<Article>;
  // Function used to search an article.  This prop is optional, if is not defined search input will be hidden
  onSearch?(value: string): Promise<ArticleItem[]>;
  // Event handler for the close button. This prop is optional, if this function is not defined the close button will not be displayed
  onButtonCloseClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Function used when the user submits the "Was this helpful" form. This prop is optional, if is not defined the "Was this helpful" section will be hidden
  onWasHelpfulSubmit?(
    value: ArticleFeedback,
    analyticsEvent?: UIAnalyticsEvent,
  ): Promise<boolean>;
  // Event handler for the "Yes" button of the "Was this helpful" section. This prop is optional
  onWasHelpfulYesButtonClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Event handler for the "No" button of the "Was this helpful" section. This prop is optional
  onWasHelpfulNoButtonClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Event handler for the "Back" button. This prop is optional
  onBackButtonClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Function executed when the article rendering begins
  onArticleRenderBegin?(): void;
  // Function executed when the article rendering finishes
  onArticleRenderDone?(): void;
  // Default content. This prop is optional
  defaultContent?: React.ReactNode;
  // Footer content. This prop is optional
  footer?: React.ReactNode;
  // Wrapped content
  children?: React.ReactNode;
}

export interface State {
  view: VIEW;
  footer?: React.ReactNode;
  defaultContent?: React.ReactNode;
  // Article
  articleId: string;
  history: HistoryItem[]; // holds all the articles ID the user has navigated
  hasNavigatedToDefaultContent: boolean;
  articleFullyVisible: boolean; // This will true only if an article 100% visible, that means, after the open animation and before close animation
  // Search
  searchValue: string;
  searchResult: ArticleItem[];
  searchState: REQUEST_STATE;
}

export interface HelpContextInterface {
  help: {
    view: VIEW;
    isBackbuttonVisible(): boolean;
    isDefaultContent(): boolean;
    isFooter(): boolean;
    isSearchVisible(): boolean;
    loadArticle(id?: string): void;
    setArticleFullyVisible(isVisible: boolean): void;
    isArticleVisible(): boolean;
    getCurrentArticle(): HistoryItem | undefined;
    articleIdSetter?(id: string): void;
    onButtonCloseClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    onWasHelpfulYesButtonClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    onWasHelpfulNoButtonClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    onBackButtonClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    onArticleRenderBegin?(): void;
    onArticleRenderDone?(): void;
    history: HistoryItem[]; // holds all the articles ID the user has navigated
    footer?: React.ReactNode;
    defaultContent?: React.ReactNode;
    navigateBack(): void;
    onWasHelpfulSubmit?(
      value: ArticleFeedback,
      analyticsEvent?: UIAnalyticsEvent,
    ): Promise<boolean>;
    onSearch(value: string): void;
    searchResult: ArticleItem[];
    searchState: REQUEST_STATE;
    searchValue: string;
    articleId?: string;
    articleFullyVisible: boolean;
  };
}

const defaultValues = {
  view: VIEW.DEFAULT_CONTENT,
  footer: undefined,
  defaultContent: undefined,
  // Article
  articleId: '',
  history: [], // holds all the articles ID the user has navigated
  hasNavigatedToDefaultContent: false,
  articleFullyVisible: false,
  // Search values
  searchValue: '',
  searchResult: [],
  searchState: REQUEST_STATE.done,
};

const initialiseHelpData = (data: State) => {
  return Object.assign(defaultValues, data);
};

const HelpContext = createContext<Partial<HelpContextInterface>>({});

class HelpContextProviderImplementation extends React.Component<
  Props & { createAnalyticsEvent?: CreateUIAnalyticsEvent },
  State
> {
  requestLoadingTimeout: any;

  constructor(props: Props) {
    super(props);

    this.state = initialiseHelpData({
      ...defaultValues,
      articleId: this.props.articleId ? this.props.articleId : '',
      footer: this.props.footer,
      defaultContent: this.props.defaultContent,
    });
  }

  componentDidMount() {
    if (this.props.articleId !== '') {
      this.loadArticle();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.requestLoadingTimeout);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // sync state.articleId with prop.articleId
    if (this.props.articleId !== prevProps.articleId) {
      this.setState({
        articleId: this.props.articleId ? this.props.articleId : '',
        view: VIEW.ARTICLE,
      });
    }

    const lastArticleId =
      this.state.history.length > 0
        ? this.state.history[this.state.history.length - 1].id
        : '';
    if (
      this.state.articleId !== prevState.articleId &&
      this.state.view !== VIEW.ARTICLE_NAVIGATION &&
      this.state.articleId !== lastArticleId
    ) {
      this.loadArticle();
    }
  }

  onSearch = async (value: string) => {
    const { onSearch } = this.props;
    const searchValue = value;

    await this.setState({ searchValue });

    // Execute this function only if the this.props.onSearch is defined
    if (onSearch) {
      // If the amount of caracters is > than the minimun defined to fire a search...
      if (searchValue.length > MIN_CHARACTERS_FOR_SEARCH) {
        try {
          this.setState({ searchState: REQUEST_STATE.loading });
          const searchResult = await onSearch(searchValue);
          this.setState({
            searchResult,
            searchState: REQUEST_STATE.done,
          });
        } catch (error) {
          this.setState({ searchState: REQUEST_STATE.error });
        }
      }

      // If the search input is empty, the search results should be empty and
      // the state.view should change to VIEW.ARTICLE
      if (searchValue.length === 0) {
        this.setState({
          view: VIEW.ARTICLE,
          searchResult: [],
          searchState: REQUEST_STATE.done,
        });
      }
    }
  };

  loadArticle = async (id?: string) => {
    const articleId = id ? id : this.state.articleId;

    // If articleId isn't empty, try lo load the article with ID = articleId
    // otherwise display the default content
    if (articleId) {
      if (this.state.hasNavigatedToDefaultContent) {
        await this.setState({
          hasNavigatedToDefaultContent: false,
          history: [],
        });
      }

      await this.setState({
        view: VIEW.ARTICLE,
      });
      this.getArticle(articleId);
    } else {
      this.setState({
        history: [],
        view: VIEW.DEFAULT_CONTENT,
      });
    }
  };

  updateHistoryItem = (uid: number, update: Partial<HistoryItem>) => {
    const history: HistoryItem[] = [...this.state.history];
    const index = history.findIndex(
      (historyItem: HistoryItem) => historyItem.uid === uid,
    );

    // update the historyItem only if exist in the state.history array
    if (index !== -1) {
      history[index] = {
        ...history[index],
        ...update,
      };

      this.setState({ history });
    }
  };

  getArticle = (articleId: string) => {
    let newHistoryItemAdded: boolean = false;
    const uid = Math.floor(Math.random() * Math.pow(10, 17));

    const updateNewLastItem = (uid: number, update: any) => {
      // if the new historyItem wasn't added to the history yet
      // add it and update the values with what it comes from the "update" param
      if (!newHistoryItemAdded) {
        // New article
        let newHistoryItem: HistoryItem = {
          uid,
          id: articleId,
          state: REQUEST_STATE.done,
          ...update,
        };

        this.setState(
          prevState => ({
            history: [...prevState.history, newHistoryItem],
          }),
          () => {
            newHistoryItemAdded = true;
          },
        );
      } else {
        // if the new historyItem was added already, just update its value
        // with what it comes from the "update" param
        this.updateHistoryItem(uid, update);
      }
    };

    // Execute this function only if onGetArticle was defined
    if (this.props.onGetArticle) {
      try {
        // if is the first article we are going to display in the ArticleContent area
        // (which means the state.history is 0) display loading state after ${LOADING_TIMEOUT}ms
        // passed after the request. Otherwise, display the loading state immediately
        if (this.state.history.length > 0) {
          this.requestLoadingTimeout = setTimeout(() => {
            updateNewLastItem(uid, { state: REQUEST_STATE.loading });
          }, LOADING_TIMEOUT);
        } else {
          updateNewLastItem(uid, { state: REQUEST_STATE.loading });
        }

        // get the article
        this.props.onGetArticle(articleId).then(
          article => {
            if (article) {
              // add the article value to the last historyItem
              // and update the state of the last historyItem to done
              updateNewLastItem(uid, {
                state: REQUEST_STATE.done,
                article: article,
              });
            } else {
              // If we don't get any article, set the state of
              // the last historyItem to error
              updateNewLastItem(uid, { state: REQUEST_STATE.error });
            }

            clearTimeout(this.requestLoadingTimeout);
          },
          () => {
            updateNewLastItem(uid, { state: REQUEST_STATE.error });
            clearTimeout(this.requestLoadingTimeout);
          },
        );
      } catch (error) {
        updateNewLastItem(uid, { state: REQUEST_STATE.error });
        clearTimeout(this.requestLoadingTimeout);
      }
    }

    return undefined;
  };

  navigateBack = async () => {
    const { history } = this.state;
    const { articleIdSetter } = this.props;

    if (articleIdSetter) {
      // If the history isn't empty, navigate back through the history
      if (history.length > 1) {
        await this.setState(prevState => {
          const newHistory = [...prevState.history.slice(0, -1)];
          articleIdSetter(`${newHistory[newHistory.length - 1].id}`);
          return {
            history: newHistory,
            view: VIEW.ARTICLE_NAVIGATION,
          };
        });
      } else if (history.length === 1) {
        await this.setState({
          view: VIEW.ARTICLE_NAVIGATION,
          hasNavigatedToDefaultContent: true,
        });
      }
    }
  };

  isBackbuttonVisible = (): boolean => {
    if (
      (this.state.history.length === 1 && !this.isDefaultContent()) ||
      !this.props.articleIdSetter
    ) {
      return false;
    }

    return this.isArticleVisible();
  };

  isSearchVisible = (): boolean => {
    if (this.props.onSearch) {
      return (
        this.state.view === VIEW.ARTICLE ||
        this.state.view === VIEW.ARTICLE_NAVIGATION ||
        this.state.view === VIEW.DEFAULT_CONTENT
      );
    }

    return false;
  };

  setArticleFullyVisible = (isVisible: boolean): void => {
    this.setState({ articleFullyVisible: isVisible });
  };

  isArticleVisible = (): boolean => {
    return (
      (this.state.view === VIEW.ARTICLE ||
        this.state.view === VIEW.ARTICLE_NAVIGATION) &&
      !this.state.hasNavigatedToDefaultContent &&
      this.state.searchValue.length <= MIN_CHARACTERS_FOR_SEARCH
    );
  };

  isFooter = (): boolean => {
    return this.state.footer !== undefined;
  };

  isDefaultContent = (): boolean => {
    return (
      this.state.defaultContent !== undefined &&
      this.state.defaultContent !== null
    );
  };

  getCurrentArticle = () => {
    const currentArticleItem = this.state.history[
      this.state.history.length - 1
    ];
    return currentArticleItem;
  };

  render() {
    const { hasNavigatedToDefaultContent, ...restState } = this.state;
    return (
      <HelpContext.Provider
        value={{
          help: {
            ...restState,
            loadArticle: this.loadArticle,
            isBackbuttonVisible: this.isBackbuttonVisible,
            isFooter: this.isFooter,
            isDefaultContent: this.isDefaultContent,
            isSearchVisible: this.isSearchVisible,
            setArticleFullyVisible: this.setArticleFullyVisible,
            isArticleVisible: this.isArticleVisible,
            navigateBack: this.navigateBack,
            articleIdSetter: this.props.articleIdSetter,
            onSearch: this.onSearch,
            getCurrentArticle: this.getCurrentArticle,
            onButtonCloseClick: this.props.onButtonCloseClick,
            onWasHelpfulSubmit: this.props.onWasHelpfulSubmit,
            onWasHelpfulYesButtonClick: this.props.onWasHelpfulYesButtonClick,
            onWasHelpfulNoButtonClick: this.props.onWasHelpfulNoButtonClick,
            onBackButtonClick: this.props.onBackButtonClick,
            onArticleRenderBegin: this.props.onArticleRenderBegin,
            onArticleRenderDone: this.props.onArticleRenderDone,
            footer: this.props.footer,
            defaultContent: this.props.defaultContent,
            articleId: this.state.articleId,
            articleFullyVisible: this.state.articleFullyVisible,
          },
        }}
        children={this.props.children}
      />
    );
  }
}

export const HelpContextProvider = withAnalyticsEvents()(
  HelpContextProviderImplementation,
);

export const HelpContextConsumer = HelpContext.Consumer;

export const withHelp = <P extends Object>(
  WrappedComponent: React.ComponentType<P>,
) => (props: any) => (
  <HelpContext.Consumer>
    {({ help }) => {
      return <WrappedComponent {...props} help={help} />;
    }}
  </HelpContext.Consumer>
);
