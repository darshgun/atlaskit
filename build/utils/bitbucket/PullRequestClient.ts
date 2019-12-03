import axios, { AxiosBasicCredentials } from 'axios';
import queryString from 'query-string';
import { PaginatedPrComments, PrComment } from './types';

const baseApiUrl = 'https://api.bitbucket.org/2.0';

type SortFilterOpts = {
  // Filters request based on object properties, see https://developer.atlassian.com/bitbucket/api/2/reference/meta/filtering
  q?: string;
  // Default order is ascending, prepend hyphen to reverse order, e.g. -updated_on
  sort?: string;
};

export class PullRequestClient {
  auth: AxiosBasicCredentials;
  repoFullName: string;

  constructor({
    auth,
    repoFullName,
  }: {
    auth: AxiosBasicCredentials;
    repoFullName: string;
  }) {
    this.auth = auth;
    this.repoFullName = repoFullName;
  }

  async getComments(
    prId: number,
    opts: SortFilterOpts,
  ): Promise<PaginatedPrComments> {
    let endpoint = `${baseApiUrl}/repositories/${this.repoFullName}/pullrequests/${prId}/comments`;
    if (opts) {
      const query = queryString.stringify(opts);
      if (query) {
        endpoint = `${endpoint}?${query}`;
      }
    }
    const response = await axios.get<PaginatedPrComments>(endpoint, {
      auth: this.auth,
    });

    return response.data;
  }

  async addComment(prId: number, text: string): Promise<PrComment> {
    let endpoint = `${baseApiUrl}/repositories/${this.repoFullName}/pullrequests/${prId}/comments`;

    const response = await axios.post<PrComment>(
      endpoint,
      {
        content: {
          raw: text,
        },
      },
      {
        auth: this.auth,
      },
    );

    return response.data;
  }
  async deleteComment(prId: number, comment: PrComment) {
    let endpoint = `${baseApiUrl}/repositories/${this.repoFullName}/pullrequests/${prId}/comments/${comment.id}`;

    const response = await axios.delete(endpoint, { auth: this.auth });

    return response.data;
  }
}
