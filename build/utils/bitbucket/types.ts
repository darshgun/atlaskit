type SelfLink = {
  self: {
    href: string;
  };
};

type HtmlLink = SelfLink & {
  html: {
    href: string;
  };
};

export type SourceOrDest = {
  // Has other properties as well
  branch: {
    name: string;
  };
  commit: {
    type: 'commit';
    hash: string;
  };
  repository: {
    type: 'repository';
    name: string;
    full_name: string;
    uuid: string;
  };
};

export type PullRequest = {
  id: number;
  title: string;
  rendered: any;
  summary: any;
  state: 'MERGED' | 'SUPERSEDED' | 'OPEN' | 'DECLINED';
  source: SourceOrDest;
  destination: SourceOrDest;
  merge_commit: string;
  comment_count: number;
  task_count: number;
  close_source_branch: boolean;
  // ISO8601
  created_on: string;
  // ISO8601
  updated_on: string;
  reviewers: any[];
  /*
  The list of users that are collaborating on this pull request.
    Collaborators are user that:

    * are added to the pull request as a reviewer (part of the reviewers
      list)
    * are not explicit reviewers, but have commented on the pull request
    * are not explicit reviewers, but have approved the pull request

    Each user is wrapped in an object that indicates the user's role and
    whether they have approved the pull request. For performance reasons,
    the API only returns this list when an API requests a pull request by
    id.
   */
  participants: any[];
};

export type PrComment = {
  id: number;
  type: 'pullrequest_comment';
  // ISO-8601
  created_on: string;
  // ISO-8601
  updated_on: string;
  deleted: boolean;
  content: {
    raw: string;
    markup: 'markdown' | 'creole' | 'plaintext';
    html: string;
  };
  links: HtmlLink & {
    code?: {
      href: string;
    };
  };
  parent?: {
    id: number;
    links: HtmlLink;
  };
  pullrequest: {
    type: 'pullrequest';
    id: number;
    title: string;
    links: HtmlLink;
  };
  user: {
    type: 'user';
    display_name: string;
    uuid: string;
    links: HtmlLink;
    nickname: string;
    account_id: string;
  };
  inline?: {
    from: number | null;
    to: number | null;
    path: string;
  };
};

export type PaginatedResponse<T> = {
  size: number;
  page: number;
  pagelen: number;
  // URI
  next?: string;
  // URI
  previous?: string;
  values: T[];
};

export type PaginatedPrComments = PaginatedResponse<PrComment>;

export type PaginatedPullRequests = PaginatedResponse<PullRequest>;
