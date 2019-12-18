export interface Article {
  body: string;
  context: string[];
  description?: string;
  id: string;
  lastPublished: string;
  objectId: string;
  productUrl?: string;
  title: string;
  type: string;
  relatedArticles?: ArticleItem[];
}

export enum ARTICLE_ITEM_TYPES {
  helpArticle = 'help-article',
  whatsNew = 'whats-new',
}
export interface ArticleItem {
  id: string;
  title?: string;
  description?: string;
  href?: string;
  type?: ARTICLE_ITEM_TYPES;
}

export interface ArticleFeedback {
  RateReasonText: string;
  negativeRateReason?: string;
}
